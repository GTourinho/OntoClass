// Imports
const N3 = require('n3');
import { quadType, displayGraph } from './compfunctions';

// Variaveis

chrome.runtime.sendMessage({from:"studentsview",message:"hi!"});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
console.log(message);
  const parser = new N3.Parser();
  parser.parse(
    message,
    (error, quad, prefixes) => {
      if (quad)
        quadType(quad);
      else
        displayGraph();
    });
    
});

