/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _cozysdkClient = __webpack_require__(1);

	var _cozysdkClient2 = _interopRequireDefault(_cozysdkClient);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_cozysdkClient2.default.defineRequest('Photo', 'all', 'function(doc) { emit(doc.title, doc); }', function (err, res) {
	    if (err != null) return alert(err);
	    _cozysdkClient2.default.run('Photo', 'all', {}, function (err, res) {

	        if (err) {
	            return false;
	        }

	        if (res.length) {
	            var first = res[0].id;

	            _cozysdkClient2.default.getFileURL(first, 'raw', function (err, photoUrl) {
	                console.log(photoUrl);
	            });
	        }
	    });
		});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cozysdk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	// Generated by CoffeeScript 1.8.0
	var client, define;

	client = require('./utils/client');

	define = function(docType, name, request, callback) {
	  var map, path, reduce, reduceArgsAndBody, view;
	  map = request.map, reduce = request.reduce;
	  if ((reduce != null) && typeof reduce === 'function') {
	    reduce = reduce.toString();
	    reduceArgsAndBody = reduce.slice(reduce.indexOf('('));
	    reduce = "function " + reduceArgsAndBody;
	  }
	  view = {
	    reduce: reduce,
	    map: "function (doc) {\n    if (doc.docType.toLowerCase() === \"" + (docType.toLowerCase()) + "\") {\n        filter = " + (map.toString()) + ";\n        filter(doc);\n    }\n}"
	  };
	  path = "request/" + docType + "/" + (name.toLowerCase()) + "/";
	  return client.put(path, view, function(error, response, body) {
	    var err, msgStatus;
	    if (error) {
	      return error;
	    } else if (response.status !== 200) {
	      msgStatus = "expected: 200, got: " + response.status;
	      err = new Error("" + msgStatus + " -- " + body.error + " -- " + body.reason);
	      err.status = response.status;
	      return callback(err);
	    } else {
	      return callback(null, body);
	    }
	  });
	};

	module.exports.create = function(docType, attributes, callback) {
	  var path;
	  path = "data/";
	  attributes.docType = docType;
	  if (attributes.id != null) {
	    return callback(new Error('cant create an object with a set id'));
	  }
	  return client.post(path, attributes, function(error, response, body) {
	    if (error) {
	      return callback("" + response.status + " -- " + body.id + " -- " + error);
	    } else {
	      return callback(null, JSON.parse(body));
	    }
	  });
	};

	module.exports.find = function(docType, id, callback) {
	  return client.get("data/" + id + "/", null, function(error, response, body) {
	    if (error) {
	      return callback(error);
	    } else if (response.status === 404) {
	      return callback(new Error("" + response.status + " -- " + body.id + " -- Error in finding object"));
	    } else {
	      return callback(null, JSON.parse(body));
	    }
	  });
	};

	module.exports.updateAttributes = function(docType, id, attributes, callback) {
	  attributes.docType = docType;
	  return client.put("data/merge/" + id + "/", attributes, function(error, response, body) {
	    if (error) {
	      return callback(error);
	    } else if (response.status === 404) {
	      return callback(new Error("Document " + id + " not found"));
	    } else if (response.status !== 200) {
	      return callback(new Error("" + response.status + " -- " + body.id + " -- Server error occured."));
	    } else {
	      return callback(null, JSON.parse(body));
	    }
	  });
	};

	module.exports.destroy = function(docType, id, callback) {
	  return client.del("data/" + id + "/", null, function(error, response) {
	    if (error) {
	      return callback(error);
	    } else if (response.status === 404) {
	      return callback(new Error("Document " + id + " not found"));
	    } else if (response.status !== 204) {
	      return callback(new Error("" + response.status + " -- " + id + " -- Server error occured."));
	    } else {
	      return callback(null);
	    }
	  });
	};

	module.exports.defineRequest = function(docType, name, request, callback) {
	  var _ref;
	  if ((_ref = typeof request) === 'function' || _ref === 'string') {
	    request = {
	      map: request
	    };
	  }
	  return define(docType, name, request, callback);
	};

	module.exports.run = function(docType, name, params, callback) {
	  var path, _ref;
	  if (typeof params === 'function') {
	    _ref = [{}, params], params = _ref[0], callback = _ref[1];
	  }
	  path = "request/" + docType + "/" + (name.toLowerCase()) + "/";
	  return client.post(path, params, function(error, response, body) {
	    if (error) {
	      return callback(error);
	    } else if (response.status !== 200) {
	      return callback(new Error("" + response.status + " -- Server error occured."));
	    } else {
	      return callback(null, JSON.parse(body));
	    }
	  });
	};

	module.exports.requestDestroy = function(docType, name, params, callback) {
	  var path, _ref;
	  if (typeof params === 'function') {
	    _ref = [{}, params], params = _ref[0], callback = _ref[1];
	  }
	  path = "request/" + docType + "/" + (name.toLowerCase()) + "/destroy/";
	  return client.put(path, params, function(error, response, body) {
	    var err, msgStatus;
	    if (error) {
	      return error;
	    } else if (response.status !== 204) {
	      msgStatus = "expected: 204, got: " + response.status;
	      err = new Error("" + msgStatus + " -- " + body.error + " -- " + body.reason);
	      err.status = response.status;
	      return callback(err);
	    } else {
	      return callback(null, body);
	    }
	  });
	};

	module.exports.convertToBinaries = function(id, name, callback) {
	  var path;
	  path = "data/" + id + "/binaries/convert";
	  if (name) {
	    path = "" + path + "/" + name;
	  }
	  return client.get(path, {}, function(error, response, body) {
	    if (error) {
	      return callback(error);
	    } else if (response.status !== 200) {
	      return callback(new Error("" + response.status + " -- Server error occured."));
	    } else {
	      return callback(null, body);
	    }
	  });
	};

	module.exports.deleteFile = function(id, name, callback) {
	  var path;
	  path = "data/" + id + "/binaries/" + name;
	  return client.del(path, {}, function(error, response, body) {
	    if (error) {
	      return callback(error);
	    } else if (response.status !== 204) {
	      return callback(new Error("" + response.status + " -- Server error occured."));
	    } else {
	      return callback(null, body);
	    }
	  });
	};

	module.exports.getFileURL = function(id, name, callback) {
	  var host, path;
	  path = "/ds-api/data/" + id + "/binaries/" + name;
	  host = window.location.host;
	  return client.getToken(function(err, auth) {
	    var url;
	    if (err) {
	      return callback(err);
	    }
	    auth = "Basic " + btoa("" + auth.appName + ":" + auth.token);
	    url = "" + window.location.protocol + "//" + host + path + "?authorization=" + auth;
	    return callback(null, encodeURI(url));
	  });
	};

	},{"./utils/client":2}],2:[function(require,module,exports){
	// Generated by CoffeeScript 1.8.0
	var getToken, playRequest;

	getToken = function(callback) {
	  var receiveToken, _ref;
	  receiveToken = function(event) {
	    var appName, token, _ref;
	    window.removeEventListener('message', receiveToken);
	    _ref = event.data, appName = _ref.appName, token = _ref.token;
	    if (typeof callback === "function") {
	      callback(null, {
	        appName: appName,
	        token: token
	      });
	    }
	    return callback = null;
	  };
	  if (window.parent == null) {
	    return callback(new Error('no parent window'));
	  }
	  if (!((_ref = window.parent) != null ? _ref.postMessage : void 0)) {
	    return callback(new Error('get a real browser'));
	  }
	  window.addEventListener('message', receiveToken, false);
	  return window.parent.postMessage({
	    action: 'getToken'
	  }, '*');
	};

	playRequest = function(method, path, attributes, callback) {
	  return getToken(function(err, auth) {
	    var basicHeader, xhr;
	    if (err) {
	      return callback(err);
	    }
	    xhr = new XMLHttpRequest;
	    xhr.open(method, "/ds-api/" + path, true);
	    xhr.onload = function() {
	      return callback(null, xhr, xhr.response);
	    };
	    xhr.onerror = function(e) {
	      err = "Request failed : " + e.target.status;
	      return callback(err);
	    };
	    xhr.setRequestHeader('Content-Type', 'application/json');
	    basicHeader = "Basic " + (btoa(auth.appName + ':' + auth.token));
	    xhr.setRequestHeader('Authorization', basicHeader);
	    if (attributes != null) {
	      return xhr.send(JSON.stringify(attributes));
	    } else {
	      return xhr.send();
	    }
	  });
	};

	module.exports = {
	  get: function(path, attributes, callback) {
	    return playRequest('GET', path, attributes, function(error, response, body) {
	      return callback(error, response, body);
	    });
	  },
	  post: function(path, attributes, callback) {
	    return playRequest('POST', path, attributes, function(error, response, body) {
	      return callback(error, response, body);
	    });
	  },
	  put: function(path, attributes, callback) {
	    return playRequest('PUT', path, attributes, function(error, response, body) {
	      return callback(error, response, body);
	    });
	  },
	  del: function(path, attributes, callback) {
	    return playRequest('DELETE', path, attributes, function(error, response, body) {
	      return callback(error, response, body);
	    });
	  },
	  getToken: getToken
	};

	},{}]},{},[1])(1)
	});
	//# sourceMappingURL=cozysdk-client.js.map


/***/ }
/******/ ]);
//# sourceMappingURL=app.bundle.js.map