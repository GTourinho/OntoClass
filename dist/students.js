/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./src/students.js ***!
  \*************************/
var select = document.getElementById("estud");
var students;

chrome.runtime.sendMessage({from:"students",message:"hi!"});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    students = message;
    for(var i = 0; i < students.length; i++) {
        var opt = students[i].profile.name.fullName;
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
});
/******/ })()
;
//# sourceMappingURL=students.js.map