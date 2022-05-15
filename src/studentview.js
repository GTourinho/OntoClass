// Imports
var TreeModel = require('tree-model');
const N3 = require('n3');
import { quadType, displayCompetencias, autoSelectProfic } from './compfunctions';

// Variaveis
var toInsert = document.createElement("div");
document.body.appendChild(toInsert);

chrome.runtime.sendMessage({from:"studentsview",message:"hi!"});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    const parser = new N3.Parser();
    parser.parse(
      message,
      (error, quad, prefixes) => {
        if (quad)
          quadType(quad);
        else
          displayCompetencias('studentview');
      });
});
    