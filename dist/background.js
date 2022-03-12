/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://apis.google.com/js/client.js";
head.appendChild(script);

window.onload = function () {
  setTimeout(function () {
    gapi.load('client:auth2', onGAPILoad);
  }, 500);
};

const API_KEY = 'AIzaSyD0S0AnY3gPu5xkeMWYbZpftsh_BOndE5s';
const DISCOVERY_DOCS = ["https://classroom.googleapis.com/$discovery/rest?version=v1"];

function onGAPILoad() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    gapi_loaded();
  }, function(error) {
    console.log('error', error)
  });
}

function gapi_loaded() {
  
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    gapi.client.classroom.courses.courseWork.list({courseId: '412519657549'}).then(function(response) {

      var courseWorks = response.result.courseWork;

      for(var i = 0; i < courseWorks.length; i++){
        console.log(courseWorks[i])
      }

    });
  })

  return true;
}
/******/ })()
;
//# sourceMappingURL=background.js.map