// Imports
var TreeModel = require('tree-model');
const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

// Variaveis
var tree = new TreeModel();
var competencias = tree.parse({name: ''});
var evidences = [];

export function quadType(quad){
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
  
export function displayCompetencias(type){

    var toInsert = document.createElement("div");
    document.body.appendChild(toInsert);
  
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
        texto.addEventListener('click', () => {

        toInsert.innerHTML = '';

        var req = document.createElement('text');
        req.style.whiteSpace = 'nowrap';
        req.style.display = 'block';
        req.style.marginTop = '10px';
        var requiretext = 'Requisito: '
        for(var i = 0; i < node.model.requires.length; i++){
            requiretext = requiretext.concat(node.model.requires[i].replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '').replace(/_/gi, ' ')).concat(', ');
        }
        req.textContent = requiretext;
        toInsert.appendChild(req);

        var con = document.createElement('text');
        con.style.whiteSpace = 'nowrap';
        con.style.display = 'block';
        con.textContent = 'Conhecimento: '.concat(node.model.knowledge).concat(',');
        toInsert.appendChild(con);

        var hab = document.createElement('text');
        hab.style.whiteSpace = 'nowrap';
        hab.style.display = 'block';
        hab.textContent = 'Habilidade: '.concat(node.model.skill).concat(',');
        toInsert.appendChild(hab);

        var ev = document.createElement('text');
        ev.style.whiteSpace = 'nowrap';
        ev.style.display = 'block';
        ev.textContent = 'Evidencias: ';
        for(var i = 0; i < node.model.evidence.length; i++){
            var newURL = evidences['http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#'.concat(node.model.evidence[i]).replace(/ /gi, '_')].source.replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '');
            var evi = document.createElement('a');
            evi.setAttribute('href', newURL);
            evi.setAttribute('target', "_blank");
            evi.textContent = node.model.evidence[i].replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '').replace(/_/gi, ' ').concat(', ');
            ev.appendChild(evi);
        }
        toInsert.appendChild(ev);

        var sim = document.createElement('text');
        sim.style.whiteSpace = 'nowrap';
        sim.style.display = 'block';
        var simtext = 'Similar à: '
        for(var i = 0; i < node.model.similar.length; i++){
            simtext = simtext.concat(node.model.similar[i].replace('http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#', '').replace(/_/gi, ' ')).concat(', ');
        }
        sim.textContent = simtext;
        toInsert.appendChild(sim);

        var prf = document.createElement('text');
        prf.style.whiteSpace = 'nowrap';
        prf.style.display = 'block';
        var desejada;

        if(node.model.proficiencyLevel == 'Beginner'){ desejada = 'Iniciante';}
        else if(node.model.proficiencyLevel == 'Intermediate'){ desejada = 'Intermediário';}
        else if(node.model.proficiencyLevel == 'Advanced'){ desejada = 'Avançado';}
        else if(node.model.proficiencyLevel == 'Expert'){ desejada = 'Especialista';}

        prf.textContent = 'Profic. Desejada: '.concat(desejada);
        toInsert.appendChild(prf);

        });
        texto.textContent = node.model.name;
        comp.appendChild(texto);

        if(type == 'selectprofic'){
            comp.appendChild(createSelectProfic(node));
        }
        else if(type == 'studentview'){
            comp.appendChild(studentProficText(node));
        }
        else{
            comp.appendChild(editButton(node));
        }

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

    if(type == 'selectprofic'){
        autoSelectProfic();
    }
          
}

function studentProficText(node){

    var profic = document.createElement('text');

    chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, function(userinfo){
        
        chrome.storage.local.get([userinfo.id], function(data) {
            
            var proficiencia;
            proficiencia = data[userinfo.id][node.model.id];
            profic.textContent = proficiencia;

            profic.style.marginLeft = '5px';
            profic.setAttribute('id', node.model.id);
        });
       
      });

 
    return profic;
}

export function autoSelectProfic(){
    var student = document.getElementById('estud').value;
    chrome.storage.local.get([student], function(data) {
        var profics = document.getElementsByTagName('select');
        for(var profic = 1; profic < profics.length; profic++){
            var a = profics[profic].id;
            profics[profic].value = data[student][a];
        }
    });
}

function createSelectProfic(node){
    var profic = document.createElement('select');
    var iniciante = document.createElement('option');
    var intermediario = document.createElement('option');
    var avancado = document.createElement('option');
    var especialista = document.createElement('option');

    iniciante.value = "Iniciante";
    iniciante.text = "Iniciante";

    intermediario.value = "Intermediario";
    intermediario.text = "Intermediario";

    avancado.value = "Avançado";
    avancado.text = "Avançado";

    especialista.value = "Especialista";
    especialista.text = "Especialista";

    profic.add(iniciante);
    profic.add(intermediario);
    profic.add(avancado);
    profic.add(especialista);

    profic.style.marginLeft = '5px';
    profic.setAttribute('id', node.model.id);

    return profic;
}

function editButton(node){
    // Botão de editar competência
    var _button = document.createElement("button");
    _button.textContent = "Editar";
    _button.setAttribute('class', 'edit');
    _button.addEventListener('click', () => {
        chrome.runtime.sendMessage({from:"competencies",message:node.model.id});
        window.location.href = "./editcompetence.html";
    });
    return _button;
}

export function getCompOptions(){
    var subsume = document.getElementById("Subsume");
    var requisito = document.getElementById("Requisito");
    var similar = document.getElementById("Similar");
    var evidencia = document.getElementById("Evidencia");
  
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
  
}

export function save(store){
    
    var requisito = document.getElementById("Requisito");
    var similar = document.getElementById("Similar");
    var evidencia = document.getElementById("Evidencia");

    var prefix1 = "http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#";
    var sub = document.getElementById("Subsume").options[document.getElementById("Subsume").selectedIndex].value;
    var prf = document.getElementById("Proficiencia").options[document.getElementById("Proficiencia").selectedIndex].value;
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
}

function saveOntologyAndReturn(ontology){
    chrome.runtime.sendMessage({from:"addcompetence", message: ontology});
    window.location.href = "./competencies.html";
  }

export function addToStore(quad){
    store.add(quad);
}