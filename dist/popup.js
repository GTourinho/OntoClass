/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
var courses;
var select = document.getElementById("cursos");

chrome.runtime.sendMessage({from:"popup",message:"hi!"});

// Gera a lista de cursos
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    courses = message;
    for(var i = 0; i < courses.length; i++) {
        var opt = courses[i];
        var el = document.createElement("option");
        el.textContent = opt.name;
        el.value = opt.id;
        select.appendChild(el);
    }
});

document.getElementById('genCurso').addEventListener('click', () => {
    var e = document.getElementById("cursos");
    var strUser = e.options[e.selectedIndex].value;
    chrome.runtime.sendMessage({from:"popup",message:strUser});
    window.location.href = "./course.html";
  });
/******/ })()
;
//# sourceMappingURL=popup.js.map