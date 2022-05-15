// Imports
var TreeModel = require('tree-model');
const N3 = require('n3');
import { quadType, displayCompetencias, autoSelectProfic } from './compfunctions';

// Variaveis
var toInsert = document.createElement("div");
document.body.appendChild(toInsert);
var select = document.getElementById("estud");
var students;
var count = 0;

chrome.runtime.sendMessage({from:"students",message:"hi!"});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if(count == 0){
        students = message;
        for(var i = 0; i < students.length; i++) {
            var opt = students[i].profile.name.fullName;
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
        count += 1;
        chrome.runtime.sendMessage({from:"students",message:"comp!"});
    }
    else{
        const parser = new N3.Parser();
        parser.parse(
          message,
          (error, quad, prefixes) => {
            if (quad)
              quadType(quad);
            else
              displayCompetencias('selectprofic');
          });
    }

});

document.getElementById('salvar').addEventListener('click', () => {
    var profics = document.getElementsByTagName('select');
    var student = {id: profics[0].value};
    for(var profic = 1; profic < profics.length; profic++){
        student[profics[profic].id] = (profics[profic].value);
    }
    chrome.storage.local.set({[student.id]: student});
  });

document.getElementById('estud').onchange = function() {
    autoSelectProfic();
}
    