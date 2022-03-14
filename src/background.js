// Imports
var TreeModel = require('tree-model');

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

    // Manipulação da API
    gapi.client.classroom.courses.courseWork.list({courseId: '412519657549'}).then(function(response) {

      var courseWorks = response.result.courseWork;

      for(var i = 0; i < courseWorks.length; i++){
        console.log(courseWorks[i])
      }

    tree = new TreeModel(),
    root = tree.parse({name: 'a', children: [{name: 'b'}]});

    var b = root.first(function (node) {
    return node.model.name === 'b';});
    
    b.addChild(tree.parse({name: 'c'}))

    root.walk({strategy: 'post'}, function (node) {
      console.log(node.model.name)
    });

    });
  })

  return true;
}