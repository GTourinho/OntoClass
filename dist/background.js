/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/find-insert-index/index.js":
/*!*************************************************!*\
  !*** ./node_modules/find-insert-index/index.js ***!
  \*************************************************/
/***/ ((module) => {

module.exports = (function () {
  'use strict';

  /**
   * Find the index to insert an element in array keeping the sort order.
   *
   * @param {function} comparatorFn The comparator function which sorted the array.
   * @param {array} arr The sorted array.
   * @param {object} el The element to insert.
   */
  function findInsertIndex(comparatorFn, arr, el) {
    var i, len;
    for (i = 0, len = arr.length; i < len; i++) {
      if (comparatorFn(arr[i], el) > 0) {
        break;
      }
    }
    return i;
  }

  return findInsertIndex;
})();


/***/ }),

/***/ "./node_modules/mergesort/index.js":
/*!*****************************************!*\
  !*** ./node_modules/mergesort/index.js ***!
  \*****************************************/
/***/ ((module) => {

module.exports = (function () {
  'use strict';

  /**
   * Sort an array using the merge sort algorithm.
   *
   * @param {function} comparatorFn The comparator function.
   * @param {array} arr The array to sort.
   * @returns {array} The sorted array.
   */
  function mergeSort(comparatorFn, arr) {
    var len = arr.length, firstHalf, secondHalf;
    if (len >= 2) {
      firstHalf = arr.slice(0, len / 2);
      secondHalf = arr.slice(len / 2, len);
      return merge(comparatorFn, mergeSort(comparatorFn, firstHalf), mergeSort(comparatorFn, secondHalf));
    } else {
      return arr.slice();
    }
  }

  /**
   * The merge part of the merge sort algorithm.
   *
   * @param {function} comparatorFn The comparator function.
   * @param {array} arr1 The first sorted array.
   * @param {array} arr2 The second sorted array.
   * @returns {array} The merged and sorted array.
   */
  function merge(comparatorFn, arr1, arr2) {
    var result = [], left1 = arr1.length, left2 = arr2.length;
    while (left1 > 0 && left2 > 0) {
      if (comparatorFn(arr1[0], arr2[0]) <= 0) {
        result.push(arr1.shift());
        left1--;
      } else {
        result.push(arr2.shift());
        left2--;
      }
    }
    if (left1 > 0) {
      result.push.apply(result, arr1);
    } else {
      result.push.apply(result, arr2);
    }
    return result;
  }

  return mergeSort;
})();


/***/ }),

/***/ "./node_modules/tree-model/index.js":
/*!******************************************!*\
  !*** ./node_modules/tree-model/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mergeSort, findInsertIndex;
mergeSort = __webpack_require__(/*! mergesort */ "./node_modules/mergesort/index.js");
findInsertIndex = __webpack_require__(/*! find-insert-index */ "./node_modules/find-insert-index/index.js");

module.exports = (function () {
  'use strict';

  var walkStrategies;

  walkStrategies = {};

  function k(result) {
    return function () {
      return result;
    };
  }

  function TreeModel(config) {
    config = config || {};
    this.config = config;
    this.config.childrenPropertyName = config.childrenPropertyName || 'children';
    this.config.modelComparatorFn = config.modelComparatorFn;
  }

  function addChildToNode(node, child) {
    child.parent = node;
    node.children.push(child);
    return child;
  }

  function Node(config, model) {
    this.config = config;
    this.model = model;
    this.children = [];
  }

  TreeModel.prototype.parse = function (model) {
    var i, childCount, node;

    if (!(model instanceof Object)) {
      throw new TypeError('Model must be of type object.');
    }

    node = new Node(this.config, model);
    if (model[this.config.childrenPropertyName] instanceof Array) {
      if (this.config.modelComparatorFn) {
        model[this.config.childrenPropertyName] = mergeSort(
          this.config.modelComparatorFn,
          model[this.config.childrenPropertyName]);
      }
      for (i = 0, childCount = model[this.config.childrenPropertyName].length; i < childCount; i++) {
        addChildToNode(node, this.parse(model[this.config.childrenPropertyName][i]));
      }
    }
    return node;
  };

  function hasComparatorFunction(node) {
    return typeof node.config.modelComparatorFn === 'function';
  }

  Node.prototype.isRoot = function () {
    return this.parent === undefined;
  };

  Node.prototype.hasChildren = function () {
    return this.children.length > 0;
  };

  function addChild(self, child, insertIndex) {
    var index;

    if (!(child instanceof Node)) {
      throw new TypeError('Child must be of type Node.');
    }

    child.parent = self;
    if (!(self.model[self.config.childrenPropertyName] instanceof Array)) {
      self.model[self.config.childrenPropertyName] = [];
    }

    if (hasComparatorFunction(self)) {
      // Find the index to insert the child
      index = findInsertIndex(
        self.config.modelComparatorFn,
        self.model[self.config.childrenPropertyName],
        child.model);

      // Add to the model children
      self.model[self.config.childrenPropertyName].splice(index, 0, child.model);

      // Add to the node children
      self.children.splice(index, 0, child);
    } else {
      if (insertIndex === undefined) {
        self.model[self.config.childrenPropertyName].push(child.model);
        self.children.push(child);
      } else {
        if (insertIndex < 0 || insertIndex > self.children.length) {
          throw new Error('Invalid index.');
        }
        self.model[self.config.childrenPropertyName].splice(insertIndex, 0, child.model);
        self.children.splice(insertIndex, 0, child);
      }
    }
    return child;
  }

  Node.prototype.addChild = function (child) {
    return addChild(this, child);
  };

  Node.prototype.addChildAtIndex = function (child, index) {
    if (hasComparatorFunction(this)) {
      throw new Error('Cannot add child at index when using a comparator function.');
    }

    return addChild(this, child, index);
  };

  Node.prototype.setIndex = function (index) {
    if (hasComparatorFunction(this)) {
      throw new Error('Cannot set node index when using a comparator function.');
    }

    if (this.isRoot()) {
      if (index === 0) {
        return this;
      }
      throw new Error('Invalid index.');
    }

    if (index < 0 || index >= this.parent.children.length) {
      throw new Error('Invalid index.');
    }

    var oldIndex = this.parent.children.indexOf(this);

    this.parent.children.splice(index, 0, this.parent.children.splice(oldIndex, 1)[0]);

    this.parent.model[this.parent.config.childrenPropertyName]
      .splice(index, 0, this.parent.model[this.parent.config.childrenPropertyName].splice(oldIndex, 1)[0]);

    return this;
  };

  Node.prototype.getPath = function () {
    var path = [];
    (function addToPath(node) {
      path.unshift(node);
      if (!node.isRoot()) {
        addToPath(node.parent);
      }
    })(this);
    return path;
  };

  Node.prototype.getIndex = function () {
    if (this.isRoot()) {
      return 0;
    }
    return this.parent.children.indexOf(this);
  };

  /**
   * Parse the arguments of traversal functions. These functions can take one optional
   * first argument which is an options object. If present, this object will be stored
   * in args.options. The only mandatory argument is the callback function which can
   * appear in the first or second position (if an options object is given). This
   * function will be saved to args.fn. The last optional argument is the context on
   * which the callback function will be called. It will be available in args.ctx.
   *
   * @returns Parsed arguments.
   */
  function parseArgs() {
    var args = {};
    if (arguments.length === 1) {
      if (typeof arguments[0] === 'function') {
        args.fn = arguments[0];
      } else {
        args.options = arguments[0];
      }
    } else if (arguments.length === 2) {
      if (typeof arguments[0] === 'function') {
        args.fn = arguments[0];
        args.ctx = arguments[1];
      } else {
        args.options = arguments[0];
        args.fn = arguments[1];
      }
    } else {
      args.options = arguments[0];
      args.fn = arguments[1];
      args.ctx = arguments[2];
    }
    args.options = args.options || {};
    if (!args.options.strategy) {
      args.options.strategy = 'pre';
    }
    if (!walkStrategies[args.options.strategy]) {
      throw new Error('Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.');
    }
    return args;
  }

  Node.prototype.walk = function () {
    var args;
    args = parseArgs.apply(this, arguments);
    walkStrategies[args.options.strategy].call(this, args.fn, args.ctx);
  };

  walkStrategies.pre = function depthFirstPreOrder(callback, context) {
    var i, childCount, keepGoing;
    keepGoing = callback.call(context, this);
    for (i = 0, childCount = this.children.length; i < childCount; i++) {
      if (keepGoing === false) {
        return false;
      }
      keepGoing = depthFirstPreOrder.call(this.children[i], callback, context);
    }
    return keepGoing;
  };

  walkStrategies.post = function depthFirstPostOrder(callback, context) {
    var i, childCount, keepGoing;
    for (i = 0, childCount = this.children.length; i < childCount; i++) {
      keepGoing = depthFirstPostOrder.call(this.children[i], callback, context);
      if (keepGoing === false) {
        return false;
      }
    }
    keepGoing = callback.call(context, this);
    return keepGoing;
  };

  walkStrategies.breadth = function breadthFirst(callback, context) {
    var queue = [this];
    (function processQueue() {
      var i, childCount, node;
      if (queue.length === 0) {
        return;
      }
      node = queue.shift();
      for (i = 0, childCount = node.children.length; i < childCount; i++) {
        queue.push(node.children[i]);
      }
      if (callback.call(context, node) !== false) {
        processQueue();
      }
    })();
  };

  Node.prototype.all = function () {
    var args, all = [];
    args = parseArgs.apply(this, arguments);
    args.fn = args.fn || k(true);
    walkStrategies[args.options.strategy].call(this, function (node) {
      if (args.fn.call(args.ctx, node)) {
        all.push(node);
      }
    }, args.ctx);
    return all;
  };

  Node.prototype.first = function () {
    var args, first;
    args = parseArgs.apply(this, arguments);
    args.fn = args.fn || k(true);
    walkStrategies[args.options.strategy].call(this, function (node) {
      if (args.fn.call(args.ctx, node)) {
        first = node;
        return false;
      }
    }, args.ctx);
    return first;
  };

  Node.prototype.drop = function () {
    var indexOfChild;
    if (!this.isRoot()) {
      indexOfChild = this.parent.children.indexOf(this);
      this.parent.children.splice(indexOfChild, 1);
      this.parent.model[this.config.childrenPropertyName].splice(indexOfChild, 1);
      this.parent = undefined;
      delete this.parent;
    }
    return this;
  };

  return TreeModel;
})();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
// Imports
var TreeModel = __webpack_require__(/*! tree-model */ "./node_modules/tree-model/index.js");

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

function getStudents(tabid) {
  var courseWorks;
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    gapi.auth.setToken({
      'access_token': token,
    });

    // Manipulação da API
    gapi.client.classroom.courses.students.list({courseId: '412519657549'}).then(function(response) {
    students = response.result.students;
    chrome.extension.sendMessage(tabid,students);
    });
  })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  if (message.from == "students"){
      var tabid = sender.id;
      getStudents(tabid);
  }
  
});
})();

/******/ })()
;
//# sourceMappingURL=background.js.map