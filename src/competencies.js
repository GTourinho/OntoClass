// Imports
var TreeModel = require('tree-model');
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
var tree = new TreeModel();
var competencias = tree.parse({name: ''});
var evidences = [];

chrome.runtime.sendMessage({from:"competencies",message:"hi!"});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  const parser = new N3.Parser();
  parser.parse(
    message,
    (error, quad, prefixes) => {
      if (quad)
        quadType(quad);
      else
        displayCompetencias();
    });
  
});

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

document.getElementById('addcomp').addEventListener('click', () => {
  window.location.href = "./addcompetence.html";
});