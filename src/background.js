// Imports
var TreeModel = require('tree-model');
var ontologia;
const N3 = require('n3');
const store = new N3.Store();
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;
const myQuad = quad(
  namedNode('https://ruben.verborgh.org/profile/#me'),
  namedNode('http://xmlns.com/foaf/0.1/givenName'),
  literal('Ruben', 'en'),
  defaultGraph(),
);

// Variaveis
var courseId = '';
var ontology;

// Google API
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://apis.google.com/js/client.js";
head.appendChild(script);
// Espera carregamento GAPI
window.onload = function () {
  setTimeout(function () {
    gapi.load('client:auth2', onGAPILoad);
  }, 500);
};

const API_KEY = 'AIzaSyD0S0AnY3gPu5xkeMWYbZpftsh_BOndE5s';
const DISCOVERY_DOCS = ["https://classroom.googleapis.com/$discovery/rest?version=v1"];

// Inicia a API do Classroom (Depois de carregar o GAPI)
function onGAPILoad() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi loaded')
  }, function(error) {
    console.log('error', error);
  });
}

// Lista os estudantes
function getStudents(tabid) {
  var students;
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    gapi.client.classroom.courses.students.list({courseId: courseId}).then(function(response) {
    students = response.result.students;
    chrome.extension.sendMessage(tabid,students);
    });
  })
}

// Lista os cursos disponiveis
function getCourses(tabid) {
  var courses;
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    if(gapi.client.classroom == null){
      getCourses(tabid);
      return;
    }

    gapi.client.classroom.courses.list().then(function(response) {
    courses = response.result.courses;
    chrome.extension.sendMessage(tabid,courses);
    });
  })
}

// Mensageiro para as paginas
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  if (message.from == "students"){
      var tabid = sender.id;
      getStudents(tabid);
  }

  else if(message.from == "popup"){
      if (message.message == "hi!"){
        var tabid = sender.id;
        getCourses(tabid);
      }
      else{
        courseId = message.message;
      }
  }

  else if(message.from == "competencies"){
    var tabid = sender.id;
    getOntology(tabid);
  }

  else if(message.from == "addcompetence"){
    if (message.message == "hi!"){
      var tabid = sender.id;
      getOntology(tabid);
    }
    else{
      chrome.storage.local.set({[courseId]: message.message});
    }
  }
  
});

function getOntology(tabid){

  chrome.storage.local.get([courseId], function(data) {

    if(data[courseId] == null){
      ontology = initOntology;
    }
    else{
      ontology = data[courseId];
    }

    const parser = new N3.Parser();
    parser.parse(
      ontology
      ,
      (error, quad, prefixes) => {

        if (quad){
          store.add(quad);
        }
        
        else{
          getCourseWorks(tabid);
        }
      });

  });
  
}

// Adiciona atividades do Classroom à ontologia, antes de enviar para outra página (obs: ignorará pré-existentes)
function getCourseWorks(tabid) {
  
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    gapi.client.classroom.courses.courseWork.list({courseId: courseId}).then(function(response) {

      var courseWorks = response.result.courseWork;
      var prefix1 = "http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#";

      
      for(var i = 0; i < courseWorks.length; i++){
        store.addQuad(
          namedNode(prefix1.concat(courseWorks[i].title.replace(/ /gi, '_'))),
          namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
          namedNode(prefix1.concat('Evidence'))
        );        
        store.addQuad(
          namedNode(prefix1.concat(courseWorks[i].title.replace(/ /gi, '_'))),
          namedNode(prefix1.concat('source')),
          namedNode(prefix1.concat(courseWorks[i].alternateLink))
        );       
      }

      sendOntology(tabid);

      });
  })

}

// Escreve toda a ontologia em uma string para enviar as outras abas
function sendOntology(tabid){

  var message;

  const writer = new N3.Writer();
  
  for (const quad of store){
    writer.addQuad(
      quad
    );
  }

  writer.end((error, result) => message = result);

  chrome.extension.sendMessage(tabid,message);

}

var initOntology =
`@prefix : <http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#> .
      @prefix owl: <http://www.w3.org/2002/07/owl#> .
      @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
      @prefix xml: <http://www.w3.org/XML/1998/namespace> .
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
      @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
      @base <http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies> .
      
      <http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies> rdf:type owl:Ontology .
      
      #################################################################
      #    Object Properties
      #################################################################
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasEvidence
      :hasEvidence rdf:type owl:ObjectProperty ;
                  rdfs:subPropertyOf owl:topObjectProperty ;
                  rdfs:domain :Competency ;
                  rdfs:range :Evidence .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasProficiencyLevel
      :hasProficiencyLevel rdf:type owl:ObjectProperty ;
                          rdfs:domain :Competency ;
                          rdfs:range :Proficiency_Level .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isComposedOf
      :isComposedOf rdf:type owl:ObjectProperty ;
                    rdfs:subPropertyOf owl:topObjectProperty ;
                    owl:inverseOf :subsumes ;
                    rdfs:domain :Competency ;
                    rdfs:range :Competency .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isSimilarTo
      :isSimilarTo rdf:type owl:ObjectProperty ,
                            owl:SymmetricProperty ;
                  rdfs:domain :Competency ;
                  rdfs:range :Competency .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#requires
      :requires rdf:type owl:ObjectProperty ;
                rdfs:subPropertyOf owl:topObjectProperty ;
                rdfs:domain :Competency ;
                rdfs:range :Competency .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#subsumes
      :subsumes rdf:type owl:ObjectProperty ;
                rdfs:domain :Competency ;
                rdfs:range :Competency .
      
      
      #################################################################
      #    Data properties
      #################################################################
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasKnowledge
      :hasKnowledge rdf:type owl:DatatypeProperty ;
                    rdfs:domain :Competency ;
                    rdfs:range xsd:string .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasSkill
      :hasSkill rdf:type owl:DatatypeProperty ;
                rdfs:domain :Competency ;
                rdfs:range xsd:string .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#name
      :name rdf:type owl:DatatypeProperty ;
            rdfs:subPropertyOf owl:topDataProperty ;
            rdfs:domain :Competency ;
            rdfs:range xsd:string .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#source
      :source rdf:type owl:DatatypeProperty ;
              rdfs:subPropertyOf owl:topDataProperty ;
              rdfs:domain :Evidence ;
              rdfs:range xsd:string .
      
      
      #################################################################
      #    Classes
      #################################################################
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Competency
      :Competency rdf:type owl:Class .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Evidence
      :Evidence rdf:type owl:Class .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Proficiency_Level
      :Proficiency_Level rdf:type owl:Class ;
                        owl:equivalentClass [ rdf:type owl:Class ;
                                              owl:oneOf ( :Advanced
                                                          :Beginner
                                                          :Expert
                                                          :Intermediate
                                                        )
                                            ] .
      
      
      #################################################################
      #    Individuals
      #################################################################
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Adicionar_propriedades_de_objeto_a_uma_classe
      :Adicionar_propriedades_de_objeto_a_uma_classe rdf:type owl:NamedIndividual ,
                                                              :Competency ;
                                                    :hasProficiencyLevel :Advanced ;
                                                    :subsumes :Fazer_ontologias_no_protege ;
                                                    :hasKnowledge "Ontologias" ;
                                                    :name "Adicionar propriedades de objeto a uma classe" .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Advanced
      :Advanced rdf:type owl:NamedIndividual ,
                        :Proficiency_Level .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Atividade_1
      :Atividade_1 rdf:type owl:NamedIndividual ,
                            :Evidence ;
                  :source "example" .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Beginner
      :Beginner rdf:type owl:NamedIndividual ,
                        :Proficiency_Level .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Expert
      :Expert rdf:type owl:NamedIndividual ,
                      :Proficiency_Level .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Fazer_ontologias_no_protege
      :Fazer_ontologias_no_protege rdf:type owl:NamedIndividual ,
                                            :Competency ;
                                  :hasEvidence :Atividade_1 ;
                                  :hasProficiencyLevel :Intermediate ;
                                  :isComposedOf :Adicionar_propriedades_de_objeto_a_uma_classe ;
                                  :hasKnowledge "Ontologias" ;
                                  :hasSkill "Criar ontologias" ;
                                  :name "Fazer ontologias no protege" .
      
      
      ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Intermediate
      :Intermediate rdf:type owl:NamedIndividual ,
                            :Proficiency_Level .
      
      
      ###  Generated by the OWL API (version 4.5.9.2019-02-01T07:24:44Z) https://github.com/owlcs/owlapi
      `