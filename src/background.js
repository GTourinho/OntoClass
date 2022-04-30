// Imports
var TreeModel = require('tree-model');

var courseId = '';

// Google API
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://apis.google.com/js/client.js";
head.appendChild(script);
// Espera carregamento GAPI
window.onload = function () {
  setTimeout(function () {
    gapi.load('client:auth2', onGAPILoad);
  }, 500);
};

const API_KEY = 'AIzaSyD0S0AnY3gPu5xkeMWYbZpftsh_BOndE5s';
const DISCOVERY_DOCS = ["https://classroom.googleapis.com/$discovery/rest?version=v1"];

// Inicia a API do Classroom (Depois de carregar o GAPI)
function onGAPILoad() {
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi loaded')
  }, function(error) {
    console.log('error', error);
  });
}

// Lista os estudantes
function getStudents(tabid) {
  var students;
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    gapi.client.classroom.courses.students.list({courseId: courseId}).then(function(response) {
    students = response.result.students;
    chrome.extension.sendMessage(tabid,students);
    });
  })
}

// Lista os cursos disponiveis
function getCourses(tabid) {
  var courses;
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    gapi.client.classroom.courses.list().then(function(response) {
    courses = response.result.courses;
    chrome.extension.sendMessage(tabid,courses);
    });
  })
}

// Mensageiro para as paginas
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  if (message.from == "students"){
      var tabid = sender.id;
      getStudents(tabid);
  }

  else if(message.from == "popup"){
      if (message.message == "hi!"){
        var tabid = sender.id;
        getCourses(tabid);
      }
      else{
        courseId = message.message;
      }
  }
  
});