// Imports
var TreeModel = require('tree-model');
var d3 = require('d3');

// Variaveis
var tree = new TreeModel();
var competencias;

// Dimensoes e margens (impressao da arvore)
const margin = {top: 20, right: 90, bottom: 30, left: 130},
width  = 660 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
const treemap = d3.tree().size([height, width]);

// Adiciona SVG no documento (impressao da arvore)
const svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)

// Pega a arvore no armazenamento, e imprime
chrome.storage.local.get(['comp'], function(data) {
  if(data.comp == null){
    competencias = tree.parse({name: 'competencias', level: 'black'});
    chrome.storage.local.set({ comp: competencias })
  }
  else{
    competencias = tree.parse(data.comp.model);
  }
  printArvore(competencias);
});

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