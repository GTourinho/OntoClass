// Imports
var TreeModel = require('tree-model');

tree = new TreeModel(),
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
});