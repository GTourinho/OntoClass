// Imports
var TreeModel = require('tree-model');
var d3 = require('d3');
const N3 = require('n3');

// Variaveis
var tree = new TreeModel();
var competencias = tree.parse({name: 'competencias', level: 'black'});
var ontology;

chrome.storage.local.get(['ont'], function(data) {
  if(data.ont == null){
    ontology = `@prefix : <http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#> .
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
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#hasEvidence
    :hasEvidence rdf:type owl:ObjectProperty ;
                 rdfs:subPropertyOf owl:topObjectProperty ;
                 rdfs:domain :Competency ;
                 rdfs:range :Evidence .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#hasProficiencyLevel
    :hasProficiencyLevel rdf:type owl:ObjectProperty ;
                         rdfs:subPropertyOf owl:topObjectProperty ;
                         rdfs:domain :Competency ;
                         rdfs:range :Proficiency_Level .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#isComposedOf
    :isComposedOf rdf:type owl:ObjectProperty ;
                  rdfs:subPropertyOf owl:topObjectProperty ;
                  owl:inverseOf :subsumes ;
                  rdfs:domain :Competency ;
                  rdfs:range :Competency .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#isSimilarTo
    :isSimilarTo rdf:type owl:ObjectProperty ;
                 rdfs:domain :Competency ;
                 rdfs:range :Competency .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#requires
    :requires rdf:type owl:ObjectProperty ;
              rdfs:subPropertyOf owl:topObjectProperty ;
              rdfs:domain :Competency ;
              rdfs:range :Competency .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#subsumes
    :subsumes rdf:type owl:ObjectProperty ;
              rdfs:domain :Competency ;
              rdfs:range :Competency .
    
    
    ###  http://www.w3.org/2002/07/owl#topObjectProperty
    owl:topObjectProperty rdfs:domain :Competency ;
                          rdfs:range :Proficiency_Level .
    
    
    #################################################################
    #    Data properties
    #################################################################
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasKnowledge
    :hasKnowledge rdf:type owl:DatatypeProperty ;
                  rdfs:domain :Competency .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasSkill
    :hasSkill rdf:type owl:DatatypeProperty ;
              rdfs:domain :Competency .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#name
    :name rdf:type owl:DatatypeProperty ;
          rdfs:subPropertyOf owl:topDataProperty ;
          rdfs:domain :Competency .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#source
    :source rdf:type owl:DatatypeProperty ;
            rdfs:subPropertyOf owl:topDataProperty ;
            rdfs:domain :Evidence .
    
    
    #################################################################
    #    Classes
    #################################################################
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#Competency
    :Competency rdf:type owl:Class .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#Evidence
    :Evidence rdf:type owl:Class .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#Proficiency_Level
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
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Atividade_1
    :Atividade_1 rdf:type owl:NamedIndividual ;
                 :source "example" .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Fazer_ontologias_no_protege
    :Fazer_ontologias_no_protege rdf:type owl:NamedIndividual ,
                                          :Competency ;
                                 :hasEvidence :Atividade_1 ;
                                 :hasProficiencyLevel :Intermediate ;
                                 :hasKnowledge "Ontologias" ;
                                 :name "Fazer ontologias no protege" .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#Advanced
    :Advanced rdf:type owl:NamedIndividual .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#Beginner
    :Beginner rdf:type owl:NamedIndividual .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#Expert
    :Expert rdf:type owl:NamedIndividual .
    
    
    ###  http://www.semanticweb.org/gabriel/ontologies/2022/4/untitled-ontology-5#Intermediate
    :Intermediate rdf:type owl:NamedIndividual .
    
    
    ###  Generated by the OWL API (version 4.5.9.2019-02-01T07:24:44Z) https://github.com/owlcs/owlapi    
    `;
  }
  else{
    ontology = data.ont;
  }
  getCompetenciesFromOntology();
});

// Dimensoes e margens (impressao da arvore)
const margin = {top: 20, right: 90, bottom: 30, left: 130},
width  = 660 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
const treemap = d3.tree().size([height, width]);

// Adiciona SVG no documento (impressao da arvore)
const svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)

document.getElementById('add').addEventListener('click', () => {
  var no = document.getElementById('no').value;
  var noPai = document.getElementById('no-pai').value

  if (noPai != ''){
    var pai = competencias.first(function (node) {
    return node.model.name === noPai;});
    pai.addChild(tree.parse({name: no, level: 'black'}))
  }
  else{
    competencias.addChild(tree.parse({name: no, level: 'black'}))
  }

  printArvore(competencias);
});

document.getElementById('del').addEventListener('click', () => {
  var no = document.getElementById('no').value;
  no = competencias.first(function (node) {
    return node.model.name === no;});

  path = no.getPath()
  pai = path[path.length-2];

  for(var i = 0; i < no.model.children.length; i++){
    pai.addChild(tree.parse({name: no.model.children[i].name, level: 'black'}));
  }

  no.drop();
  
  printArvore(competencias);
});

document.getElementById('del+').addEventListener('click', () => {
  var no = document.getElementById('no').value;
  no = competencias.first(function (node) {
    return node.model.name === no;});

  no.drop();
  
  printArvore(competencias);
});

function printArvore(treeData){

  chrome.storage.local.set({ comp: treeData });

  // Update do SVG
  d3.selectAll("svg > *").remove();  
  var g = svg.append("g")
  .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //  Adiciona os dados para a hierarquia da arvore
  let nodes = d3.hierarchy(treeData, d => d.children);

  nodes = treemap(nodes);

  // Links entre os nós
  const link = g.selectAll(".link")
  .data( nodes.descendants().slice(1))
  .enter().append("path")
  .attr("class", "link")
  .style("stroke", d => d.data.model.level)
  .attr("d", d => {
  return "M" + d.y + "," + d.x
    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
    + " " + d.parent.y + "," + d.parent.x;
  });

  // Adiciona cada nó como um grupo
  const node = g.selectAll(".node")
  .data(nodes.descendants())
  .enter().append("g")
  .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
  .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

  // Texto do nó
  node.append("text")
  .attr("dy", ".35em")
  .attr("x", d => d.children ? 5 * -1 : 5)
  .attr("y", d => d.children && d.depth !== 0 ? - 8 : 0)
  .style("text-anchor", d => d.children ? "end" : "start")
  .text(d => d.data.model.name);
}

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
        console.log("# That's all, folks!", prefixes);
      }
    });

}

function quadType(quad){
  // is competency
  if(quad._object.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#Competency' && quad._predicate.id == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'){
    
  }
  // has evidence
  else if(quad._predicate.id == 'http://www.semanticweb.org/gabriel/ontologies/2022/4/competencies#hasEvidence'){
    
  }
}