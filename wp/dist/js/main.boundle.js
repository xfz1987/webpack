/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "08593d89df93651eca0c"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(14)(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16).Buffer))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".layer {\n  width: 600px;\n  height: 300px;\n  background-color: pink;\n}\n.layer > div {\n  width: 400px;\n  height: 100px;\n  background: url(" + __webpack_require__(13) + ") no-repeat;\n  background-size: 400px 100px;\n}\n.flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".bar {\n  width: 100%;\n  -webkit-transform: translateX(-100%);\n          transform: translateX(-100%);\n}\n.bar:hover {\n  width: 50%;\n}\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports
exports.i(__webpack_require__(10), "");

// module
exports.push([module.i, "*{\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}\r\nhtml,body{\r\n\tbackground: red;\r\n}\r\nul, li{\r\n\tlist-style: none;\r\n}\r\n\r\n.flex-div{\r\n\tdisplay: -webkit-box;\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n}", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(3, function() {
			var newContent = __webpack_require__(3);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(4, function() {
			var newContent = __webpack_require__(4);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _layer = __webpack_require__(11);

var _layer2 = _interopRequireDefault(_layer);

__webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Layer() {
	return {
		name: 'layer',
		tpl: _layer2.default
	};
}

exports.default = Layer;

/***/ }),
/* 8 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(2, function() {
			var newContent = __webpack_require__(2);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".flex-demo{\r\n\tdisplay: -webkit-box;\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n}\r\n.clearfix{\r\n\tclear:both;\r\n}", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"layer\">\r\n\t<div> this is layer </div>\r\n\t<img src=\"" + __webpack_require__(12) + "\">\r\n</div>";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "image/1-a8635.jpg";

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(6);

__webpack_require__(5);

var _layer = __webpack_require__(7);

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App() {
	var NUM = 1;
	alert(NUM);
	console.log(_layer2.default);
	var layer = new _layer2.default();
	document.getElementById('app').innerHTML = layer.tpl;
};

new App();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(15)
var ieee754 = __webpack_require__(17)
var isArray = __webpack_require__(18)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 18 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);