// Imports
var TreeModel = require('tree-model');
const N3 = require('n3');

// Variaveis
var tree = new TreeModel();
var competencias = tree.parse({name: ''});
var evidences = [];
var subsume = document.getElementById("Subsume");
var requisito = document.getElementById("Requisito");
var similar = document.getElementById("Similar");
var evidencia = document.getElementById("Evidencia");

chrome.runtime.sendMessage({from:"addcompetence",message:"hi!"});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  getCompetenciesFromOntology(message);

});

function getCompetenciesFromOntology(ontology){
    const parser = new N3.Parser();
    parser.parse(
      ontology
      ,
      (error, quad, prefixes) => {
        if (quad){
          quadType(quad);
        }
        else{
          
          displayCompetencias();
  
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
      comp.model.name =  quad._object.id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '').replace(/\"/gi, '');
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
      comp.model.skill.push(quad._object.id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '').replace(/\"/gi, ''));
    }
    // hasKnowledge
    else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasKnowledge'){
      var comp = competencias.first(function (node) {
        return node.model.id === quad._subject.id;});
      comp.model.knowledge.push(quad._object.id.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '').replace(/\"/gi, ''));
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

  function displayCompetencias(){

    competencias.walk(function (node) {
        if(node.model.name != ''){
            var sub = document.createElement("option");
            sub.textContent = node.model.name;
            sub.value = node.model.id;

            var req = document.createElement("option");
            req.textContent = node.model.name;
            req.value = node.model.id;

            var sim = document.createElement("option");
            sim.textContent = node.model.name;
            sim.value = node.model.id;
            
            subsume.appendChild(sub);
            requisito.appendChild(req);
            similar.appendChild(sim);
        }
    });


    for (const evidence in evidences) {
        var ev = document.createElement("option");
        ev.textContent = evidence.replace("http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#", '').replace(/_/gi, ' ');
        ev.value = evidence.source;
        evidencia.appendChild(ev);
      }

  };