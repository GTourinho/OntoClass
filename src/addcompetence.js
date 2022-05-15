// Imports
var TreeModel = require('tree-model');
const N3 = require('n3');
import { quadType, getCompOptions, save } from './compfunctions';

// Variaveis
const store = new N3.Store();

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
          store.add(quad);
        }
        else{
          
          getCompOptions('add');
  
        }
      });
      
  }

document.getElementById('Salvar').addEventListener('click', () => {save(store, 'addcompetence')});