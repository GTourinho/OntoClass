// Imports
var TreeModel = require('tree-model');
const N3 = require('n3');

// Variaveis
var tree = new TreeModel();
var competencias = tree.parse({name: ''});
var ontology;
var evidences = {}

chrome.storage.local.get(['ont'], function(data) {
  if(data.ont == null){
    ontology = `@prefix : <http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#> .
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
    
    `;
  }
  else{
    ontology = data.ont;
  }
  getCompetenciesFromOntology();
});

function getCompetenciesFromOntology(){

  const parser = new N3.Parser();
  parser.parse(
    ontology
    ,
    (error, quad, prefixes) => {
      if (quad){
        console.log(quad);
        quadType(quad);
      }
      else{
        
        endOfParser();

      }
    });
    
}

function quadType(quad){
  // is competency
  if(quad._object.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Competency' && quad._predicate.id == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'){
      // verifica se ja esta na arvore
      if(competencias.first(function (node) {
      return node.model.id === quad._subject.id;}) == null){
        newCompetence(quad._subject.id);
      }
  }
  // has evidence
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasEvidence'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    comp.model.evidence.push(quad._object.id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '').replace(/_/gi, ' '));
  }
  // name
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#name'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    comp.model.name =  quad._object.id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '');
  }
  // subsumes
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#subsumes'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    var parent = competencias.first(function (node) {
      return node.model.id === quad.object.id;});
    if(parent == null){
      newCompetence(quad._object.id);
      parent = competencias.first(function (node) {
        return node.model.id === quad.object.id;});
    }
    comp = comp.drop();
    comp.model.subsumes = quad.object.id;
    parent.addChild(comp);
  }
  // hasSkill
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasSkill'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    comp.model.skill.push(quad._object.id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', ''));
  }
  // hasKnowledge
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasKnowledge'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    comp.model.knowledge.push(quad._object.id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', ''));
  }
  // hasProficiencyLevel
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasProficiencyLevel'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    comp.model.proficiencyLevel =  quad._object.id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '');
  }
  // requires
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#requires'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    comp.model.requires.push(quad._object.id);
  }
  // isSimilarTo
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isSimilarTo'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    comp.model.similar.push(quad._object.id);
  }
  // isComposedOf
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isComposedOf'){
    var comp = competencias.first(function (node) {
      return node.model.id === quad._subject.id;});
    comp.model.composedOf.push(quad._object.id);
  }
  // Evidencias:

  // is evidence
  else if(quad._object.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Evidence' && quad._predicate.id == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'){
    var id = quad._subject.id;
    evidences[id] = {name : id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '').replace(/_/gi, ' ')};
  }
  // source
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#source'){
    var id = quad._subject.id;
    evidences[id].source = quad._object.id;
  }
}    

function newCompetence(_id){
  competencias.addChild(tree.parse({id: _id, name: '', evidence: [], subsumes: '', proficiencyLevel: '', requires: [], similar: [], skill: [], knowledge: [], composedOf: []}));
}

// Após o parser da ontologia
function endOfParser(){
  console.log(competencias);
        console.log(evidences);

        competencias.walk(function (node) {
          if(node.model.name != ''){
            // Elementos do nó
            var comp = document.createElement("li");
            comp.setAttribute('id', node.model.id);

            // Caso a competência tenha filhos
            if(node.hasChildren()){
              // Adicionar caret
              var span = document.createElement("span");
              span.setAttribute("class","caret");
              comp.appendChild(span);
            }

            // Adicionar texto
            var texto = document.createElement('text');
            texto.textContent = node.model.name;
            comp.appendChild(texto);
            
            // Botão de editar competência
            var _button = document.createElement("button");
            _button.textContent = "Editar";
            _button.setAttribute('class', 'edit');
            comp.appendChild(_button);

            // Caso a competência tenha filhos
            if(node.hasChildren()){
              // Adicionar espaço para os filhos
              var nest = document.createElement("ul");
              nest.setAttribute('class', 'nested');
              comp.appendChild(nest);
            }


            // Encontrar o pai para o nó
            if(node.model.subsumes == ''){
              var parent = document.getElementById("myUL");
            }
            else{
              var parent = document.getElementById(node.model.subsumes).getElementsByClassName("nested")[0];
            }
            parent.appendChild(comp);
          }
        });
        
        // Expansão e colapso de nó da árvore
        var toggler = document.getElementsByClassName("caret");
        var i;

        for (i = 0; i < toggler.length; i++) {
          toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
          });
        }
}