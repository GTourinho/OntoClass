/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
var courses;
var select = document.getElementById("cursos");
var count = 0;

chrome.runtime.sendMessage({from:"popup",message:"hi!"});

// Gera a lista de cursos
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(count == 0){
        courses = message;
        for(var i = 0; i < courses.length; i++) {
            var opt = courses[i];
            var el = document.createElement("option");
            el.textContent = opt.name;
            el.value = opt.id;
            select.appendChild(el);
        }
        count += 1;
    }
    else if(message == 'error'){
        window.location.href = "./studentview.html";
    }
    else{
        window.location.href = "./course.html";
    }
});

document.getElementById('genCurso').style.marginTop = '10px';
document.getElementById('genCurso').style.width = '50%';
document.getElementById('genCurso').style.marginLeft = '25%';
document.getElementById('genCurso').style.marginRight = '25%';

document.getElementById('genCurso').addEventListener('click', () => {
    var e = document.getElementById("cursos");
    var strUser = e.options[e.selectedIndex].value;
    chrome.runtime.sendMessage({from:"popup",message:strUser});
  });


/******/ })()
;
//# sourceMappingURL=popup.js.map