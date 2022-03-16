// Imports
// var TreeModel = require('tree-model');
var d3 = require('d3');

// Dimensoes e margens para a arvore
const margin = {top: 20, right: 90, bottom: 30, left: 90},
width  = 660 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
const treemap = d3.tree().size([height, width]);

// Adiciona SVG para a arvore
const svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)

// Cria e manipula arvore
const data = {
  "name": "Comp",
  "level": "black",
  "children": [
    {
      "name": "A",
      "level": "black"
    },

  ]
};

data.children[0].children = [{"name": "B", "level": "black"}];
data.children[0].children[0].children = [{"name": "D", "level": "black"}];
data.children.push({"name": "C", "level": "black"});
data.children.push({"name": "E", "level": "black"});
printArvore(data);
data.children.push({"name": "F", "level": "black"});
printArvore(data);

function printArvore(treeData){

  // Update do SVG
  d3.selectAll("svg > *").remove();  
  g = svg.append("g")
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
  .style("stroke", d => d.data.level)
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

  // Adiciona texto ao nó
  node.append("text")
  .attr("dy", ".35em")
  .attr("x", d => d.children ? 5 * -1 : 5)
  .attr("y", d => d.children && d.depth !== 0 ? - 8 : 0)
  .style("text-anchor", d => d.children ? "end" : "start")
  .text(d => d.data.name);
}

/*tree = new TreeModel(),
competencias = tree.parse({name: 'competencias'});

document.getElementById('add').addEventListener('click', () => {
  var no = document.getElementById('no').value;
  var noPai = document.getElementById('no-pai').value

  if (noPai != ''){
    var pai = competencias.first(function (node) {
    return node.model.name === noPai;});
    pai.addChild(tree.parse({name: no}))
  }
  else{
    competencias.addChild(tree.parse({name: no}))
  }

  competencias.walk(function (node) {
    console.log(node.model.name)
  });
}); */