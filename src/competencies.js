// Imports
var TreeModel = require('tree-model');
const N3 = require('n3');
import { quadType, displayCompetencias } from './compfunctions';

// Variaveis

chrome.runtime.sendMessage({from:"competencies",message:"hi!"});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  
  const parser = new N3.Parser();
  parser.parse(
    message,
    (error, quad, prefixes) => {
      if (quad)
        quadType(quad);
      else
        displayCompetencias('editbutton');
    });
    
});

document.getElementById('addcomp').addEventListener('click', () => {
  window.location.href = "./addcompetence.html";
});