// Imports
var TreeModel = require('tree-model');
const N3 = require('n3');


// Variaveis
const store = new N3.Store();
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;
const myQuad = quad(
  namedNode('https://ruben.verborgh.org/profile/#me'),
  namedNode('http://xmlns.com/foaf/0.1/givenName'),
  literal('Ruben', 'en'),
  defaultGraph(),
);
var tree = new TreeModel();
var competencias = tree.parse({name: ''});
var evidences = [];
var subsume = document.getElementById("Subsume");
var requisito = document.getElementById("Requisito");
var similar = document.getElementById("Similar");
var evidencia = document.getElementById("Evidencia");
var proficiencia = document.getElementById("Proficiencia");
var count = 0;
var editCompId;
var editComp;

chrome.runtime.sendMessage({from:"editcompetence",message:"hi!"});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if(count == 0){
        editCompId = message;
        count += 1;
    }
    else{
        getCompetenciesFromOntology(message);
    }

});

function autoSelectEditComp(){
    
    editComp = competencias.first(function (node) { return node.model.id == editCompId});
    
    document.getElementById('nome').value = editComp.model.name;
    document.getElementById('Habilidade').value = editComp.model.skill;
    document.getElementById('Conhecimento').value = editComp.model.knowledge;
    if(editComp.model.proficiencyLevel == 'Beginner'){
        document.getElementById("Proficiencia").value = 'Iniciante';
    }
    else if(editComp.model.proficiencyLevel == 'Intermediate'){
        document.getElementById("Proficiencia").value = 'Intermediário';
    }
    else if(editComp.model.proficiencyLevel == 'Advanced'){
        document.getElementById("Proficiencia").value = 'Avançado';
    }
    else if(editComp.model.proficiencyLevel == 'Expert'){
        document.getElementById("Proficiencia").value = 'Especialista';
    }
    if(editComp.model.subsumes != ''){
        document.getElementById("Subsume").value = editComp.model.subsumes;
    }

    for(var i = 0; i < editComp.model.evidence.length; i++){
        for(option in document.getElementById("Evidencia").options){
            if(document.getElementById("Evidencia")[option].value == editComp.model.evidence[i]){
                
                document.getElementById("Evidencia")[option].selected = true;
            }
        }
    }   


    for(var i = 0; i < editComp.model.requires.length; i++){
        for(option in document.getElementById("Requisito").options){
            if(document.getElementById("Requisito")[option].value == editComp.model.requires[i]){
                
                document.getElementById("Requisito")[option].selected = true;

            }
        }
    }   

    for(var i = 0; i < editComp.model.similar.length; i++){
        for(option in document.getElementById("Similar").options){
            if(document.getElementById("Similar")[option].value == editComp.model.similar[i]){
                
                document.getElementById("Similar")[option].selected = true;

            }
        }
    }   

    
    
};

function getCompetenciesFromOntology(ontology){
    const parser = new N3.Parser();
    parser.parse(
      ontology
      ,
      (error, quad, prefixes) => {
        if (quad){
          quadType(quad);
          store.addQuad(quad);
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
      comp.model.evidence.push(quad._object.id);
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
      if(comp == null){
        newCompetence(quad.subject.id);
        comp = competencias.first(function (node) {
          return node.model.id === quad.subject.id;});
      }
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
        ev.value = evidence;
        evidencia.appendChild(ev);
    }

      autoSelectEditComp();

  };

  document.getElementById('Salvar').addEventListener('click', () => {

    removeValues();

    var prefix1 = "http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#";
    var sub = subsume.options[subsume.selectedIndex].value;
    var prf = proficiencia.options[proficiencia.selectedIndex].value;
    var nm = document.getElementById('nome').value
    var hab = document.getElementById('Habilidade').value
    var con = document.getElementById('Conhecimento').value

    if(prf == 'Iniciante'){
      prf = 'Beginner';
    }
    else if(prf == 'Intermediário'){
      prf = 'Intermediate';
    }
    else if(prf == 'Avançado'){
      prf = 'Advanced';
    }
    else if(prf == 'Especialista'){
      prf = 'Expert';
    }

    // Inicia o escritor da ontologia para string
    const writer = new N3.Writer();
  
    for (const quad of store){
      writer.addQuad(
        quad
      );
    }

    if(nm != ''){
      writer.addQuad(
        namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
        namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Competency')
      );
      writer.addQuad(
        namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
        namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#name'),
        literal(nm)
      );
      writer.addQuad(
        namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
        namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasProficiencyLevel'),
        namedNode(prf)
      );
      if(sub != 'Nenhuma'){
        writer.addQuad(
          namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
          namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#subsumes'),
          namedNode(sub)
        );
        // Adiciona também o isComposedOf (inverso)
        writer.addQuad(
          namedNode(sub),
          namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isComposedOf'),
          namedNode(prefix1.concat(nm).replace(/ /gi, '_'))
        );
      }
      for (var option of requisito.options){
        if (option.selected) {
          writer.addQuad(
          namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
          namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#requires'),
          namedNode(option.value)
        );
        } 
      }
      for (var option of similar.options){
        // Adicionar também a simétrica
        if (option.selected) {
          writer.addQuad(
          namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
          namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isSimilarTo'),
          namedNode(option.value)
          );
          writer.addQuad(
            namedNode(option.value),
            namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isSimilarTo'),
            namedNode(prefix1.concat(nm).replace(/ /gi, '_'))
          );
        }
        }
      if(hab != 'Nenhuma'){
        writer.addQuad(
          namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
          namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasSkill'),
          literal(hab)
        );
      }
      if(con != 'Nenhuma'){
        writer.addQuad(
          namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
          namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasKnowledge'),
          literal(con)
        );
      }
      for (var option of evidencia.options){
          if (option.selected) {
            writer.addQuad(
              namedNode(prefix1.concat(nm).replace(/ /gi, '_')),
              namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasEvidence'),
              namedNode(option.value.replace(/ /gi, '_'))
            );
          }
      }
    }
  
    writer.end((error, result) => saveOntologyAndReturn(result));

  });

  // Deleta triplas que contém a competência, menos as que ela é objeto #subumes e #requires, as quais são adicionadas com o novo id
  function removeValues(){

    prefix1 = 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#';
    var nm = document.getElementById('nome').value

    for (const quad of store.match(namedNode(editComp.model.id), null, null)){
        store.delete(quad);
    }

    for (const quad of store.match(null, namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#requires'), namedNode(editComp.model.id))){
      store.addQuad(namedNode(quad.subject.id), namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#requires'), namedNode(prefix1.concat(nm).replace(/ /gi, '_')));
      store.delete(quad);
    }

    for (const quad of store.match(null, namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#subsumes'), namedNode(editComp.model.id))){
      store.addQuad(namedNode(quad.subject.id), namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#subsumes'), namedNode(prefix1.concat(nm).replace(/ /gi, '_')));
      store.delete(quad);
    }

    for (const quad of store.match(null, namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isSimilarTo'), namedNode(editComp.model.id))){
      store.delete(quad);
    }

    for (const quad of store.match(null, namedNode('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#isComposedOf'), namedNode(editComp.model.id))){
      store.delete(quad);
    }



  }
  
  // Deleta todas as triplas que contém a competência
  function removeAllValues(){

    for (const quad of store.match(namedNode(editComp.model.id), null, null)){
        store.delete(quad);
    }

    for (const quad of store.match(null, null, namedNode(editComp.model.id))){
        store.delete(quad);
    }

  }

  document.getElementById('Deletar').addEventListener('click', () => {
    removeAllValues();
    const writer = new N3.Writer();
    for (const quad of store){
        writer.addQuad(
          quad
        );
      }
    writer.end((error, result) => saveOntologyAndReturn(result));
  });

  function saveOntologyAndReturn(ontology){
    chrome.runtime.sendMessage({from:"editcompetence", message: ontology});
    window.location.href = "./competencies.html";
  }