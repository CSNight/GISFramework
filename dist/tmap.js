(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tmap", [], factory);
	else if(typeof exports === 'object')
		exports["tmap"] = factory();
	else
		root["tmap"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/component/MapOption.js":
/*!************************************!*\
  !*** ./src/component/MapOption.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var options = {
  crs: L.CRS.EPSG3857,
  center: [0, 0],
  zoom: 0,
  boxZoom: true,
  doubleClickZoom: true,
  minZoom: 0,
  maxZoom: 18,
  layers: [],
  maxBounds: undefined,
  renderer: L.svg(),
  attributionControl: false,
  zoomControl: false,
  zoomAnimation: true,
  zoomAnimationThreshold: 4,
  fadeAnimation: true,
  markerZoomAnimation: true,
  transform3DLimit: 8388608,
  // Precision limit of a 32-bit float
  zoomSnap: 1,
  zoomDelta: 1,
  trackResize: true,
  maxBoundsViscosity: 0,
  closePopupOnClick: true
};
var MapOption = new Proxy(options, {
  get: function get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set: function set(target, p, value, receiver) {
    Reflect.set(target, p, value, receiver);
    return true;
  }
});
var _default = MapOption;
exports.default = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./src/component/TCircle.js":
/*!**********************************!*\
  !*** ./src/component/TCircle.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleProxy = circleProxy;
exports.circle = circle;

var _TPath = _interopRequireDefault(__webpack_require__(/*! ./TPath */ "./src/component/TPath.js"));

var _VectorOptProxy = __webpack_require__(/*! ./VectorOptProxy */ "./src/component/VectorOptProxy.js");

var _TMap = _interopRequireDefault(__webpack_require__(/*! ../core/TMap */ "./src/core/TMap.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var circleOption = {
  radius: 0.0,
  t: 'circle'
};
circleOption = Object.assign(_TPath.default, circleOption);
circleOption.fill = true;

function circleProxy(layer) {
  return (0, _VectorOptProxy.resetStyleHandler)(layer);
}

function circle(geo, options) {
  var opt = (0, _VectorOptProxy.optionFill)(options, circleOption);
  var Te = L.circle(geo, options);
  Te.$options = opt;
  Te = circleProxy(Te);

  _TMap.default.map.addLayer(Te);

  return Te;
}

/***/ }),

/***/ "./src/component/TCircleMarker.js":
/*!****************************************!*\
  !*** ./src/component/TCircleMarker.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleMarkerProxy = circleMarkerProxy;
exports.circleMarker = circleMarker;

var _TPath = _interopRequireDefault(__webpack_require__(/*! ./TPath */ "./src/component/TPath.js"));

var _VectorOptProxy = __webpack_require__(/*! ./VectorOptProxy */ "./src/component/VectorOptProxy.js");

var _TMap = _interopRequireDefault(__webpack_require__(/*! ../core/TMap */ "./src/core/TMap.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cMarkerOption = {
  radius: 10,
  t: 'circleMarker'
};
cMarkerOption = Object.assign(_TPath.default, cMarkerOption);
cMarkerOption.fill = true;

function circleMarkerProxy(layer) {
  return (0, _VectorOptProxy.resetStyleHandler)(layer);
}

function circleMarker(geo, options) {
  var opt = (0, _VectorOptProxy.optionFill)(options, cMarkerOption);
  var Te = L.circleMarker(geo, options);
  Te.$options = opt;
  Te = circleMarkerProxy(Te);

  _TMap.default.map.addLayer(Te);

  return Te;
}

/***/ }),

/***/ "./src/component/TPath.js":
/*!********************************!*\
  !*** ./src/component/TPath.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var pathOption = {
  stroke: true,
  color: '#3388ff',
  weight: 3,
  opacity: 1.0,
  lineCap: 'round',
  lineJoin: 'round',
  dashArray: null,
  dashOffset: null,
  fill: false,
  fillColor: null,
  fillOpacity: 0.2,
  fillRule: 'evenodd',
  bubblingMouseEvents: true,
  renderer: undefined,
  className: '',
  interactive: true,
  pane: 'overlayPane',
  attribution: null
};
var _default = pathOption;
exports.default = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./src/component/TPolygon.js":
/*!***********************************!*\
  !*** ./src/component/TPolygon.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polygonProxy = polygonProxy;
exports.polygon = polygon;

var _TPath = _interopRequireDefault(__webpack_require__(/*! ./TPath */ "./src/component/TPath.js"));

var _VectorOptProxy = __webpack_require__(/*! ./VectorOptProxy */ "./src/component/VectorOptProxy.js");

var _TMap = _interopRequireDefault(__webpack_require__(/*! ../core/TMap */ "./src/core/TMap.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var polygonOption = {
  smoothFactor: 1.0,
  noClip: false,
  t: 'polygon'
};
polygonOption = Object.assign(_TPath.default, polygonOption);
polygonOption.fill = true;

function polygonProxy(layer) {
  return (0, _VectorOptProxy.resetStyleHandler)(layer);
}

function polygon(geo, options) {
  var opt = (0, _VectorOptProxy.optionFill)(options, polygonOption);
  var Te = L.polygon(geo, options);
  Te.$options = opt;
  Te = polygonProxy(Te);

  _TMap.default.map.addLayer(Te);

  return Te;
}

/***/ }),

/***/ "./src/component/TPolyline.js":
/*!************************************!*\
  !*** ./src/component/TPolyline.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polylineProxy = polylineProxy;
exports.polyline = polyline;

var _TPath = _interopRequireDefault(__webpack_require__(/*! ./TPath */ "./src/component/TPath.js"));

var _VectorOptProxy = __webpack_require__(/*! ./VectorOptProxy */ "./src/component/VectorOptProxy.js");

var _TMap = _interopRequireDefault(__webpack_require__(/*! ../core/TMap */ "./src/core/TMap.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var polylineOption = {
  smoothFactor: 1.0,
  noClip: false,
  t: 'polyline'
};
polylineOption = Object.assign(_TPath.default, polylineOption);

function polylineProxy(layer) {
  return (0, _VectorOptProxy.resetStyleHandler)(layer);
}

function polyline(geo, options) {
  var opt = (0, _VectorOptProxy.optionFill)(options, polylineOption);
  var Te = L.polyline(geo, options);
  Te.$options = opt;
  Te = polylineProxy(Te);

  _TMap.default.map.addLayer(Te);

  return Te;
}

/***/ }),

/***/ "./src/component/TRectangle.js":
/*!*************************************!*\
  !*** ./src/component/TRectangle.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rectangleProxy = rectangleProxy;
exports.rectangle = rectangle;

var _TPath = _interopRequireDefault(__webpack_require__(/*! ./TPath */ "./src/component/TPath.js"));

var _VectorOptProxy = __webpack_require__(/*! ./VectorOptProxy */ "./src/component/VectorOptProxy.js");

var _TMap = _interopRequireDefault(__webpack_require__(/*! ../core/TMap */ "./src/core/TMap.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rectangleOption = {
  smoothFactor: 1.0,
  noClip: false,
  t: 'rectangle'
};
rectangleOption = Object.assign(_TPath.default, rectangleOption);
rectangleOption.fill = true;

function rectangleProxy(layer) {
  return (0, _VectorOptProxy.resetStyleHandler)(layer);
}

function rectangle(geo, options) {
  var opt = (0, _VectorOptProxy.optionFill)(options, rectangleOption);
  var Te = L.rectangle(geo, options);
  Te.$options = opt;
  Te = rectangleProxy(Te);

  _TMap.default.map.addLayer(Te);

  return Te;
}

/***/ }),

/***/ "./src/component/VectorOptProxy.js":
/*!*****************************************!*\
  !*** ./src/component/VectorOptProxy.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionFill = optionFill;
exports.resetStyleHandler = resetStyleHandler;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function optionFill(source, template) {
  if (!source || source === {}) {
    return new Proxy(template, {});
  }

  var temp = JSON.parse(JSON.stringify(template));

  for (var key in temp) {
    if (source.hasOwnProperty(key)) {
      temp[key] = source[key];
    }
  }

  for (var _key in source) {
    if (!temp.hasOwnProperty(_key)) {
      temp[_key] = source[_key];
    }
  }

  return new Proxy(temp, {});
}

function resetStyleHandler(layer) {
  var handler = {
    //setStyle 后 同步options 内容至$options
    apply: function apply(target, _this, args) {
      var result = Reflect.apply.apply(Reflect, arguments);
      layer.$options = Object.assign.apply(Object, [layer.$options].concat(_toConsumableArray(args)));
      layer.redraw();
      return result;
    }
  }; //直接修改options 更新属性 设置样式，重绘

  var handlerLayer = {
    set: function set(target, p, value, receiver) {
      Reflect.set(target, p, value, receiver);

      if (p === 'options') {
        target.option = optionFill(target[p], target.$options);
        target.setStyle(target.option);
        target.redraw();
      }

      return true;
    }
  };
  layer.setStyle = new Proxy(layer.setStyle, handler);
  layer = new Proxy(layer, handlerLayer);
  return layer;
}

/***/ }),

/***/ "./src/controls/Zoom.js":
/*!******************************!*\
  !*** ./src/controls/Zoom.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zoomControl = void 0;
var zoomOpt = {
  show: true,
  activate: true,
  opt: {
    position: 'topleft',
    zoomInText: '+',
    zoomInTitle: 'Zoom in',
    zoomOutText: '&#x2212	',
    zoomOutTitle: 'Zoom out'
  }
};

var zoomControl = function zoomControl() {
  var options = new Proxy(Object.assign({}, zoomOpt), {});
  var Tz = L.control.zoom(options.opt);
  Tz.$options = options;

  Tz.__proto__.show = function () {
    this.$options.show = true;
    this.$options.activate = true;
    this._container.style.display = 'block';
  };

  Tz.__proto__.hide = function () {
    this.$options.show = false;
    this.$options.activate = false;
    this._container.style.display = 'none';
  };

  return Tz;
};

exports.zoomControl = zoomControl;

/***/ }),

/***/ "./src/core/ControlManager.js":
/*!************************************!*\
  !*** ./src/core/ControlManager.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TMap = _interopRequireDefault(__webpack_require__(/*! ./TMap */ "./src/core/TMap.js"));

var _Zoom = __webpack_require__(/*! ../controls/Zoom */ "./src/controls/Zoom.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var controls = {
  zoom: _Zoom.zoomControl,
  drawer: '',
  scaleBar: '',
  graticule: '',
  printer: '',
  cts: {},
  init: function init() {
    _TMap.default.map.addControl = new Proxy(_TMap.default.map.addControl, {
      apply: function apply(target, _this, argArray) {
        var result = Reflect.apply.apply(Reflect, arguments);

        if (argArray.length > 0 && argArray[0].hasOwnProperty('_leaflet_id')) {
          var ct = argArray[0];
          _TMap.default.controls.cts[ct._leaflet_id] = ct;
        }

        return result;
      }
    });
    _TMap.default.map.removeControl = new Proxy(_TMap.default.map.removeControl, {
      apply: function apply(target, _this, argArray) {
        var result = Reflect.apply.apply(Reflect, arguments);

        if (argArray.length > 0 && argArray[0].hasOwnProperty('_leaflet_id')) {
          var ct = argArray[0];

          if (_TMap.default.controls.cts[ct._leaflet_id]) {
            delete _TMap.default.controls.cts[ct._leaflet_id];
          }
        }

        return result;
      }
    });
  },
  addControl: function addControl(control, type) {
    var ct = _TMap.default.map.addControl(control);

    this.cts[type] = ct;
    return ct;
  },
  removeControl: function removeControl(ct) {
    if (_typeof(ct) === 'object') {
      _TMap.default.map.removeControl(ct);

      for (var k in this.cts) {
        var tmpCt = this.cts[k];

        if (tmpCt._leaflet_id === ct._leaflet_id) {
          delete this.cts[k];
          break;
        }
      }
    } else {
      var _tmpCt = this.cts[ct];

      if (_tmpCt !== undefined) {
        _TMap.default.map.removeControl(_tmpCt);

        delete this.cts[ct];
      }
    }
  },
  hide: function hide(ct) {
    ct.hide();
  },
  show: function show(ct) {
    ct.show();
  },
  hideAll: function hideAll() {
    for (var k in this.cts) {
      this.cts[k].hide();
    }
  },
  showAll: function showAll() {
    for (var k in this.cts) {
      this.cts[k].show();
    }
  }
};
var _default = controls;
exports.default = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./src/core/TMap.js":
/*!**************************!*\
  !*** ./src/core/TMap.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MapOption = _interopRequireDefault(__webpack_require__(/*! ../component/MapOption */ "./src/component/MapOption.js"));

var _TRectangle = __webpack_require__(/*! ../component/TRectangle */ "./src/component/TRectangle.js");

var _TCircle = __webpack_require__(/*! ../component/TCircle */ "./src/component/TCircle.js");

var _TPolyline = __webpack_require__(/*! ../component/TPolyline */ "./src/component/TPolyline.js");

var _TCircleMarker = __webpack_require__(/*! ../component/TCircleMarker */ "./src/component/TCircleMarker.js");

var _TPolygon = __webpack_require__(/*! ../component/TPolygon */ "./src/component/TPolygon.js");

var _ControlManager = _interopRequireDefault(__webpack_require__(/*! ./ControlManager */ "./src/core/ControlManager.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var T = new Proxy({
  map: null,
  rectangle: _TRectangle.rectangle,
  circle: _TCircle.circle,
  circleMarker: _TCircleMarker.circleMarker,
  marker: null,
  polyline: _TPolyline.polyline,
  polygon: _TPolygon.polygon,
  controls: _ControlManager.default
}, {});

T.createMap = function (dom) {
  T.map = L.map(dom, _MapOption.default);
  T.controls.init();
  return T.map;
};

T.marker = function (options) {};

var _default = T;
exports.default = _default;
module.exports = exports["default"];

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _TMap = _interopRequireDefault(__webpack_require__(/*! ./core/TMap */ "./src/core/TMap.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.T = _TMap.default;

_TMap.default.createMap('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
  foo: 'bar'
}).addTo(_TMap.default.map);
var bounds = [[54.559322, 20.767822], [56.1210604, 33.021240]]; // create an orange rectangle

var s = _TMap.default.rectangle(bounds, {
  color: '#ff7800',
  weight: 1
}).addTo(_TMap.default.map);

window.s = s; // zoom the map to the rectangle bounds

_TMap.default.map.fitBounds(bounds);

_TMap.default.map.addControl(_TMap.default.controls.zoom());

console.log(s);
console.log(_TMap.default);

/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90bWFwL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly90bWFwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RtYXAvLi9zcmMvY29tcG9uZW50L01hcE9wdGlvbi5qcyIsIndlYnBhY2s6Ly90bWFwLy4vc3JjL2NvbXBvbmVudC9UQ2lyY2xlLmpzIiwid2VicGFjazovL3RtYXAvLi9zcmMvY29tcG9uZW50L1RDaXJjbGVNYXJrZXIuanMiLCJ3ZWJwYWNrOi8vdG1hcC8uL3NyYy9jb21wb25lbnQvVFBhdGguanMiLCJ3ZWJwYWNrOi8vdG1hcC8uL3NyYy9jb21wb25lbnQvVFBvbHlnb24uanMiLCJ3ZWJwYWNrOi8vdG1hcC8uL3NyYy9jb21wb25lbnQvVFBvbHlsaW5lLmpzIiwid2VicGFjazovL3RtYXAvLi9zcmMvY29tcG9uZW50L1RSZWN0YW5nbGUuanMiLCJ3ZWJwYWNrOi8vdG1hcC8uL3NyYy9jb21wb25lbnQvVmVjdG9yT3B0UHJveHkuanMiLCJ3ZWJwYWNrOi8vdG1hcC8uL3NyYy9jb250cm9scy9ab29tLmpzIiwid2VicGFjazovL3RtYXAvLi9zcmMvY29yZS9Db250cm9sTWFuYWdlci5qcyIsIndlYnBhY2s6Ly90bWFwLy4vc3JjL2NvcmUvVE1hcC5qcyIsIndlYnBhY2s6Ly90bWFwLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIm9wdGlvbnMiLCJjcnMiLCJMIiwiQ1JTIiwiRVBTRzM4NTciLCJjZW50ZXIiLCJ6b29tIiwiYm94Wm9vbSIsImRvdWJsZUNsaWNrWm9vbSIsIm1pblpvb20iLCJtYXhab29tIiwibGF5ZXJzIiwibWF4Qm91bmRzIiwidW5kZWZpbmVkIiwicmVuZGVyZXIiLCJzdmciLCJhdHRyaWJ1dGlvbkNvbnRyb2wiLCJ6b29tQ29udHJvbCIsInpvb21BbmltYXRpb24iLCJ6b29tQW5pbWF0aW9uVGhyZXNob2xkIiwiZmFkZUFuaW1hdGlvbiIsIm1hcmtlclpvb21BbmltYXRpb24iLCJ0cmFuc2Zvcm0zRExpbWl0Iiwiem9vbVNuYXAiLCJ6b29tRGVsdGEiLCJ0cmFja1Jlc2l6ZSIsIm1heEJvdW5kc1Zpc2Nvc2l0eSIsImNsb3NlUG9wdXBPbkNsaWNrIiwiTWFwT3B0aW9uIiwiUHJveHkiLCJnZXQiLCJ0YXJnZXQiLCJrZXkiLCJyZWNlaXZlciIsIlJlZmxlY3QiLCJzZXQiLCJwIiwidmFsdWUiLCJjaXJjbGVPcHRpb24iLCJyYWRpdXMiLCJ0IiwiT2JqZWN0IiwiYXNzaWduIiwiZmlsbCIsImNpcmNsZVByb3h5IiwibGF5ZXIiLCJjaXJjbGUiLCJnZW8iLCJvcHQiLCJUZSIsIiRvcHRpb25zIiwibWFwIiwiYWRkTGF5ZXIiLCJjTWFya2VyT3B0aW9uIiwiY2lyY2xlTWFya2VyUHJveHkiLCJjaXJjbGVNYXJrZXIiLCJwYXRoT3B0aW9uIiwic3Ryb2tlIiwiY29sb3IiLCJ3ZWlnaHQiLCJvcGFjaXR5IiwibGluZUNhcCIsImxpbmVKb2luIiwiZGFzaEFycmF5IiwiZGFzaE9mZnNldCIsImZpbGxDb2xvciIsImZpbGxPcGFjaXR5IiwiZmlsbFJ1bGUiLCJidWJibGluZ01vdXNlRXZlbnRzIiwiY2xhc3NOYW1lIiwiaW50ZXJhY3RpdmUiLCJwYW5lIiwiYXR0cmlidXRpb24iLCJwb2x5Z29uT3B0aW9uIiwic21vb3RoRmFjdG9yIiwibm9DbGlwIiwicG9seWdvblByb3h5IiwicG9seWdvbiIsInBvbHlsaW5lT3B0aW9uIiwicG9seWxpbmVQcm94eSIsInBvbHlsaW5lIiwicmVjdGFuZ2xlT3B0aW9uIiwicmVjdGFuZ2xlUHJveHkiLCJyZWN0YW5nbGUiLCJvcHRpb25GaWxsIiwic291cmNlIiwidGVtcGxhdGUiLCJ0ZW1wIiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwiaGFzT3duUHJvcGVydHkiLCJyZXNldFN0eWxlSGFuZGxlciIsImhhbmRsZXIiLCJhcHBseSIsIl90aGlzIiwiYXJncyIsInJlc3VsdCIsImFyZ3VtZW50cyIsInJlZHJhdyIsImhhbmRsZXJMYXllciIsIm9wdGlvbiIsInNldFN0eWxlIiwiem9vbU9wdCIsInNob3ciLCJhY3RpdmF0ZSIsInBvc2l0aW9uIiwiem9vbUluVGV4dCIsInpvb21JblRpdGxlIiwiem9vbU91dFRleHQiLCJ6b29tT3V0VGl0bGUiLCJUeiIsImNvbnRyb2wiLCJfX3Byb3RvX18iLCJfY29udGFpbmVyIiwic3R5bGUiLCJkaXNwbGF5IiwiaGlkZSIsImNvbnRyb2xzIiwiZHJhd2VyIiwic2NhbGVCYXIiLCJncmF0aWN1bGUiLCJwcmludGVyIiwiY3RzIiwiaW5pdCIsImFkZENvbnRyb2wiLCJhcmdBcnJheSIsImxlbmd0aCIsImN0IiwiX2xlYWZsZXRfaWQiLCJyZW1vdmVDb250cm9sIiwidHlwZSIsImsiLCJ0bXBDdCIsImhpZGVBbGwiLCJzaG93QWxsIiwiVCIsIm1hcmtlciIsImNyZWF0ZU1hcCIsImRvbSIsIndpbmRvdyIsInRpbGVMYXllciIsImZvbyIsImFkZFRvIiwiYm91bmRzIiwicyIsImZpdEJvdW5kcyIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVB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Ozs7Ozs7Ozs7Ozs7O0FDNUJmOzs7O0FBRUFJLE1BQU0sQ0FBQ0osQ0FBUDs7QUFDQSxjQUFFRSxTQUFGLENBQVksS0FBWjs7QUFDQXhJLENBQUMsQ0FBQzJJLFNBQUYsQ0FBWSwwREFBWixFQUF3RTtBQUFDQyxLQUFHLEVBQUU7QUFBTixDQUF4RSxFQUFzRkMsS0FBdEYsQ0FBNEYsY0FBRTVGLEdBQTlGO0FBQ0EsSUFBSTZGLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBRCxFQUF5QixDQUFDLFVBQUQsRUFBYSxTQUFiLENBQXpCLENBQWIsQyxDQUNBOztBQUNBLElBQUlDLENBQUMsR0FBRyxjQUFFOUQsU0FBRixDQUFZNkQsTUFBWixFQUFvQjtBQUFDdEYsT0FBSyxFQUFFLFNBQVI7QUFBbUJDLFFBQU0sRUFBRTtBQUEzQixDQUFwQixFQUFtRG9GLEtBQW5ELENBQXlELGNBQUU1RixHQUEzRCxDQUFSOztBQUNBeUYsTUFBTSxDQUFDSyxDQUFQLEdBQVdBLENBQVgsQyxDQUNBOztBQUNBLGNBQUU5RixHQUFGLENBQU0rRixTQUFOLENBQWdCRixNQUFoQjs7QUFDQSxjQUFFN0YsR0FBRixDQUFNMEUsVUFBTixDQUFpQixjQUFFUCxRQUFGLENBQVdoSCxJQUFYLEVBQWpCOztBQUNBNkksT0FBTyxDQUFDQyxHQUFSLENBQVlILENBQVo7QUFDQUUsT0FBTyxDQUFDQyxHQUFSLGdCIiwiZmlsZSI6InRtYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcInRtYXBcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1widG1hcFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJ0bWFwXCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwibGV0IG9wdGlvbnMgPSB7XG4gIGNyczogTC5DUlMuRVBTRzM4NTcsXG4gIGNlbnRlcjogWzAsIDBdLFxuICB6b29tOiAwLFxuICBib3hab29tOiB0cnVlLFxuICBkb3VibGVDbGlja1pvb206IHRydWUsXG4gIG1pblpvb206IDAsXG4gIG1heFpvb206IDE4LFxuICBsYXllcnM6IFtdLFxuICBtYXhCb3VuZHM6IHVuZGVmaW5lZCxcbiAgcmVuZGVyZXI6IEwuc3ZnKCksXG4gIGF0dHJpYnV0aW9uQ29udHJvbDogZmFsc2UsXG4gIHpvb21Db250cm9sOiBmYWxzZSxcbiAgem9vbUFuaW1hdGlvbjogdHJ1ZSxcbiAgem9vbUFuaW1hdGlvblRocmVzaG9sZDogNCxcbiAgZmFkZUFuaW1hdGlvbjogdHJ1ZSxcbiAgbWFya2VyWm9vbUFuaW1hdGlvbjogdHJ1ZSxcbiAgdHJhbnNmb3JtM0RMaW1pdDogODM4ODYwOCwgLy8gUHJlY2lzaW9uIGxpbWl0IG9mIGEgMzItYml0IGZsb2F0XG4gIHpvb21TbmFwOiAxLFxuICB6b29tRGVsdGE6IDEsXG4gIHRyYWNrUmVzaXplOiB0cnVlLFxuICBtYXhCb3VuZHNWaXNjb3NpdHk6IDAsXG4gIGNsb3NlUG9wdXBPbkNsaWNrOiB0cnVlXG59O1xuXG5sZXQgTWFwT3B0aW9uID0gbmV3IFByb3h5KG9wdGlvbnMsIHtcbiAgZ2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBrZXksIHJlY2VpdmVyKSB7XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHRhcmdldCwgcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBwLCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcbmV4cG9ydCBkZWZhdWx0IE1hcE9wdGlvbjtcbiIsImltcG9ydCBwYXRoT3B0aW9uIGZyb20gJy4vVFBhdGgnO1xuaW1wb3J0IHtvcHRpb25GaWxsLCByZXNldFN0eWxlSGFuZGxlcn0gZnJvbSAnLi9WZWN0b3JPcHRQcm94eSc7XG5pbXBvcnQgVCBmcm9tICcuLi9jb3JlL1RNYXAnO1xuXG5sZXQgY2lyY2xlT3B0aW9uID0ge1xuICByYWRpdXM6IDAuMCxcbiAgdDogJ2NpcmNsZSdcbn07XG5jaXJjbGVPcHRpb24gPSBPYmplY3QuYXNzaWduKHBhdGhPcHRpb24sIGNpcmNsZU9wdGlvbik7XG5jaXJjbGVPcHRpb24uZmlsbCA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaXJjbGVQcm94eShsYXllcikge1xuICByZXR1cm4gcmVzZXRTdHlsZUhhbmRsZXIobGF5ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2lyY2xlKGdlbywgb3B0aW9ucykge1xuICBsZXQgb3B0ID0gb3B0aW9uRmlsbChvcHRpb25zLCBjaXJjbGVPcHRpb24pO1xuICBsZXQgVGUgPSBMLmNpcmNsZShnZW8sIG9wdGlvbnMpO1xuICBUZS4kb3B0aW9ucyA9IG9wdDtcbiAgVGUgPSBjaXJjbGVQcm94eShUZSk7XG4gIFQubWFwLmFkZExheWVyKFRlKTtcbiAgcmV0dXJuIFRlO1xufVxuIiwiaW1wb3J0IHBhdGhPcHRpb24gZnJvbSAnLi9UUGF0aCc7XG5pbXBvcnQge29wdGlvbkZpbGwsIHJlc2V0U3R5bGVIYW5kbGVyfSBmcm9tICcuL1ZlY3Rvck9wdFByb3h5JztcbmltcG9ydCBUIGZyb20gJy4uL2NvcmUvVE1hcCc7XG5cbmxldCBjTWFya2VyT3B0aW9uID0ge1xuICByYWRpdXM6IDEwLFxuICB0OiAnY2lyY2xlTWFya2VyJ1xufTtcbmNNYXJrZXJPcHRpb24gPSBPYmplY3QuYXNzaWduKHBhdGhPcHRpb24sIGNNYXJrZXJPcHRpb24pO1xuY01hcmtlck9wdGlvbi5maWxsID0gdHJ1ZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNpcmNsZU1hcmtlclByb3h5KGxheWVyKSB7XG4gIHJldHVybiByZXNldFN0eWxlSGFuZGxlcihsYXllcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaXJjbGVNYXJrZXIoZ2VvLCBvcHRpb25zKSB7XG4gIGxldCBvcHQgPSBvcHRpb25GaWxsKG9wdGlvbnMsIGNNYXJrZXJPcHRpb24pO1xuICBsZXQgVGUgPSBMLmNpcmNsZU1hcmtlcihnZW8sIG9wdGlvbnMpO1xuICBUZS4kb3B0aW9ucyA9IG9wdDtcbiAgVGUgPSBjaXJjbGVNYXJrZXJQcm94eShUZSk7XG4gIFQubWFwLmFkZExheWVyKFRlKTtcbiAgcmV0dXJuIFRlO1xufVxuIiwibGV0IHBhdGhPcHRpb24gPSB7XG4gIHN0cm9rZTogdHJ1ZSxcbiAgY29sb3I6ICcjMzM4OGZmJyxcbiAgd2VpZ2h0OiAzLFxuICBvcGFjaXR5OiAxLjAsXG4gIGxpbmVDYXA6ICdyb3VuZCcsXG4gIGxpbmVKb2luOiAncm91bmQnLFxuICBkYXNoQXJyYXk6IG51bGwsXG4gIGRhc2hPZmZzZXQ6IG51bGwsXG4gIGZpbGw6IGZhbHNlLFxuICBmaWxsQ29sb3I6IG51bGwsXG4gIGZpbGxPcGFjaXR5OiAwLjIsXG4gIGZpbGxSdWxlOiAnZXZlbm9kZCcsXG4gIGJ1YmJsaW5nTW91c2VFdmVudHM6IHRydWUsXG4gIHJlbmRlcmVyOiB1bmRlZmluZWQsXG4gIGNsYXNzTmFtZTogJycsXG4gIGludGVyYWN0aXZlOiB0cnVlLFxuICBwYW5lOiAnb3ZlcmxheVBhbmUnLFxuICBhdHRyaWJ1dGlvbjogbnVsbFxufTtcbmV4cG9ydCBkZWZhdWx0IHBhdGhPcHRpb247XG4iLCJpbXBvcnQgcGF0aE9wdGlvbiBmcm9tICcuL1RQYXRoJztcbmltcG9ydCB7b3B0aW9uRmlsbCwgcmVzZXRTdHlsZUhhbmRsZXJ9IGZyb20gJy4vVmVjdG9yT3B0UHJveHknO1xuaW1wb3J0IFQgZnJvbSAnLi4vY29yZS9UTWFwJztcblxubGV0IHBvbHlnb25PcHRpb24gPSB7XG4gIHNtb290aEZhY3RvcjogMS4wLFxuICBub0NsaXA6IGZhbHNlLFxuICB0OiAncG9seWdvbidcbn07XG5wb2x5Z29uT3B0aW9uID0gT2JqZWN0LmFzc2lnbihwYXRoT3B0aW9uLCBwb2x5Z29uT3B0aW9uKTtcbnBvbHlnb25PcHRpb24uZmlsbCA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5Z29uUHJveHkobGF5ZXIpIHtcbiAgcmV0dXJuIHJlc2V0U3R5bGVIYW5kbGVyKGxheWVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlnb24oZ2VvLCBvcHRpb25zKSB7XG4gIGxldCBvcHQgPSBvcHRpb25GaWxsKG9wdGlvbnMsIHBvbHlnb25PcHRpb24pO1xuICBsZXQgVGUgPSBMLnBvbHlnb24oZ2VvLCBvcHRpb25zKTtcbiAgVGUuJG9wdGlvbnMgPSBvcHQ7XG4gIFRlID0gcG9seWdvblByb3h5KFRlKTtcbiAgVC5tYXAuYWRkTGF5ZXIoVGUpO1xuICByZXR1cm4gVGU7XG59XG4iLCJpbXBvcnQgcGF0aE9wdGlvbiBmcm9tICcuL1RQYXRoJztcbmltcG9ydCB7b3B0aW9uRmlsbCwgcmVzZXRTdHlsZUhhbmRsZXJ9IGZyb20gJy4vVmVjdG9yT3B0UHJveHknO1xuaW1wb3J0IFQgZnJvbSAnLi4vY29yZS9UTWFwJztcblxubGV0IHBvbHlsaW5lT3B0aW9uID0ge1xuICBzbW9vdGhGYWN0b3I6IDEuMCxcbiAgbm9DbGlwOiBmYWxzZSxcbiAgdDogJ3BvbHlsaW5lJ1xufTtcbnBvbHlsaW5lT3B0aW9uID0gT2JqZWN0LmFzc2lnbihwYXRoT3B0aW9uLCBwb2x5bGluZU9wdGlvbik7XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5bGluZVByb3h5KGxheWVyKSB7XG4gIHJldHVybiByZXNldFN0eWxlSGFuZGxlcihsYXllcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5bGluZShnZW8sIG9wdGlvbnMpIHtcbiAgbGV0IG9wdCA9IG9wdGlvbkZpbGwob3B0aW9ucywgcG9seWxpbmVPcHRpb24pO1xuICBsZXQgVGUgPSBMLnBvbHlsaW5lKGdlbywgb3B0aW9ucyk7XG4gIFRlLiRvcHRpb25zID0gb3B0O1xuICBUZSA9IHBvbHlsaW5lUHJveHkoVGUpO1xuICBULm1hcC5hZGRMYXllcihUZSk7XG4gIHJldHVybiBUZTtcbn1cbiIsImltcG9ydCBwYXRoT3B0aW9uIGZyb20gJy4vVFBhdGgnO1xuaW1wb3J0IHtvcHRpb25GaWxsLCByZXNldFN0eWxlSGFuZGxlcn0gZnJvbSAnLi9WZWN0b3JPcHRQcm94eSc7XG5pbXBvcnQgVCBmcm9tICcuLi9jb3JlL1RNYXAnO1xuXG5sZXQgcmVjdGFuZ2xlT3B0aW9uID0ge1xuICBzbW9vdGhGYWN0b3I6IDEuMCxcbiAgbm9DbGlwOiBmYWxzZSxcbiAgdDogJ3JlY3RhbmdsZSdcbn07XG5yZWN0YW5nbGVPcHRpb24gPSBPYmplY3QuYXNzaWduKHBhdGhPcHRpb24sIHJlY3RhbmdsZU9wdGlvbik7XG5yZWN0YW5nbGVPcHRpb24uZmlsbCA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWN0YW5nbGVQcm94eShsYXllcikge1xuICByZXR1cm4gcmVzZXRTdHlsZUhhbmRsZXIobGF5ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVjdGFuZ2xlKGdlbywgb3B0aW9ucykge1xuICBsZXQgb3B0ID0gb3B0aW9uRmlsbChvcHRpb25zLCByZWN0YW5nbGVPcHRpb24pO1xuICBsZXQgVGUgPSBMLnJlY3RhbmdsZShnZW8sIG9wdGlvbnMpO1xuICBUZS4kb3B0aW9ucyA9IG9wdDtcbiAgVGUgPSByZWN0YW5nbGVQcm94eShUZSk7XG4gIFQubWFwLmFkZExheWVyKFRlKTtcbiAgcmV0dXJuIFRlO1xufVxuXG5cbiIsImV4cG9ydCBmdW5jdGlvbiBvcHRpb25GaWxsKHNvdXJjZSwgdGVtcGxhdGUpIHtcbiAgaWYgKCFzb3VyY2UgfHwgc291cmNlID09PSB7fSkge1xuICAgIHJldHVybiBuZXcgUHJveHkodGVtcGxhdGUsIHt9KTtcbiAgfVxuICBsZXQgdGVtcCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKTtcbiAgZm9yIChsZXQga2V5IGluIHRlbXApIHtcbiAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRlbXBba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuICBmb3IgKGxldCBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKCF0ZW1wLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRlbXBba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IFByb3h5KHRlbXAsIHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0U3R5bGVIYW5kbGVyKGxheWVyKSB7XG4gIGxldCBoYW5kbGVyID0ge1xuICAgIC8vc2V0U3R5bGUg5ZCOIOWQjOatpW9wdGlvbnMg5YaF5a656IezJG9wdGlvbnNcbiAgICBhcHBseTogZnVuY3Rpb24gKHRhcmdldCwgX3RoaXMsIGFyZ3MpIHtcbiAgICAgIGxldCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KC4uLmFyZ3VtZW50cyk7XG4gICAgICBsYXllci4kb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24obGF5ZXIuJG9wdGlvbnMsIC4uLmFyZ3MpO1xuICAgICAgbGF5ZXIucmVkcmF3KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfTtcbiAgLy/nm7TmjqXkv67mlLlvcHRpb25zIOabtOaWsOWxnuaApyDorr7nva7moLflvI/vvIzph43nu5hcbiAgbGV0IGhhbmRsZXJMYXllciA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIHAsIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBwLCB2YWx1ZSwgcmVjZWl2ZXIpO1xuICAgICAgaWYgKHAgPT09ICdvcHRpb25zJykge1xuICAgICAgICB0YXJnZXQub3B0aW9uID0gb3B0aW9uRmlsbCh0YXJnZXRbcF0sIHRhcmdldC4kb3B0aW9ucyk7XG4gICAgICAgIHRhcmdldC5zZXRTdHlsZSh0YXJnZXQub3B0aW9uKTtcbiAgICAgICAgdGFyZ2V0LnJlZHJhdygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuICBsYXllci5zZXRTdHlsZSA9IG5ldyBQcm94eShsYXllci5zZXRTdHlsZSwgaGFuZGxlcik7XG4gIGxheWVyID0gbmV3IFByb3h5KGxheWVyLCBoYW5kbGVyTGF5ZXIpO1xuICByZXR1cm4gbGF5ZXI7XG59XG4iLCJsZXQgem9vbU9wdCA9IHtcbiAgc2hvdzogdHJ1ZSxcbiAgYWN0aXZhdGU6IHRydWUsXG4gIG9wdDoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAgem9vbUluVGV4dDogJysnLFxuICAgIHpvb21JblRpdGxlOiAnWm9vbSBpbicsXG4gICAgem9vbU91dFRleHQ6ICcmI3gyMjEyXHQnLFxuICAgIHpvb21PdXRUaXRsZTogJ1pvb20gb3V0J1xuICB9XG59O1xubGV0IHpvb21Db250cm9sID0gZnVuY3Rpb24gKCkge1xuICBsZXQgb3B0aW9ucyA9IG5ldyBQcm94eShPYmplY3QuYXNzaWduKHt9LCB6b29tT3B0KSwge30pO1xuICBsZXQgVHogPSBMLmNvbnRyb2wuem9vbShvcHRpb25zLm9wdCk7XG4gIFR6LiRvcHRpb25zID0gb3B0aW9ucztcbiAgVHouX19wcm90b19fLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kb3B0aW9ucy5zaG93ID0gdHJ1ZTtcbiAgICB0aGlzLiRvcHRpb25zLmFjdGl2YXRlID0gdHJ1ZTtcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH07XG4gIFR6Ll9fcHJvdG9fXy5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJG9wdGlvbnMuc2hvdyA9IGZhbHNlO1xuICAgIHRoaXMuJG9wdGlvbnMuYWN0aXZhdGUgPSBmYWxzZTtcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfTtcbiAgcmV0dXJuIFR6O1xufTtcblxuZXhwb3J0IHt6b29tQ29udHJvbH07XG5cbiIsImltcG9ydCBUIGZyb20gJy4vVE1hcCc7XG5pbXBvcnQge3pvb21Db250cm9sfSBmcm9tICcuLi9jb250cm9scy9ab29tJztcblxubGV0IGNvbnRyb2xzID0ge1xuICB6b29tOiB6b29tQ29udHJvbCxcbiAgZHJhd2VyOiAnJyxcbiAgc2NhbGVCYXI6ICcnLFxuICBncmF0aWN1bGU6ICcnLFxuICBwcmludGVyOiAnJyxcbiAgY3RzOiB7fSxcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgIFQubWFwLmFkZENvbnRyb2wgPSBuZXcgUHJveHkoVC5tYXAuYWRkQ29udHJvbCwge1xuICAgICAgYXBwbHkodGFyZ2V0LCBfdGhpcywgYXJnQXJyYXkpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKGFyZ0FycmF5Lmxlbmd0aCA+IDAgJiYgYXJnQXJyYXlbMF0uaGFzT3duUHJvcGVydHkoJ19sZWFmbGV0X2lkJykpIHtcbiAgICAgICAgICBsZXQgY3QgPSBhcmdBcnJheVswXTtcbiAgICAgICAgICBULmNvbnRyb2xzLmN0c1tjdC5fbGVhZmxldF9pZF0gPSBjdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH0pO1xuICAgIFQubWFwLnJlbW92ZUNvbnRyb2wgPSBuZXcgUHJveHkoVC5tYXAucmVtb3ZlQ29udHJvbCwge1xuICAgICAgYXBwbHkodGFyZ2V0LCBfdGhpcywgYXJnQXJyYXkpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKGFyZ0FycmF5Lmxlbmd0aCA+IDAgJiYgYXJnQXJyYXlbMF0uaGFzT3duUHJvcGVydHkoJ19sZWFmbGV0X2lkJykpIHtcbiAgICAgICAgICBsZXQgY3QgPSBhcmdBcnJheVswXTtcbiAgICAgICAgICBpZiAoVC5jb250cm9scy5jdHNbY3QuX2xlYWZsZXRfaWRdKSB7XG4gICAgICAgICAgICBkZWxldGUgVC5jb250cm9scy5jdHNbY3QuX2xlYWZsZXRfaWRdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBhZGRDb250cm9sOiBmdW5jdGlvbiAoY29udHJvbCwgdHlwZSkge1xuICAgIGxldCBjdCA9IFQubWFwLmFkZENvbnRyb2woY29udHJvbCk7XG4gICAgdGhpcy5jdHNbdHlwZV0gPSBjdDtcbiAgICByZXR1cm4gY3Q7XG4gIH0sXG4gIHJlbW92ZUNvbnRyb2w6IGZ1bmN0aW9uIChjdCkge1xuICAgIGlmICh0eXBlb2YgY3QgPT09ICdvYmplY3QnKSB7XG4gICAgICBULm1hcC5yZW1vdmVDb250cm9sKGN0KTtcbiAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5jdHMpIHtcbiAgICAgICAgbGV0IHRtcEN0ID0gdGhpcy5jdHNba107XG4gICAgICAgIGlmICh0bXBDdC5fbGVhZmxldF9pZCA9PT0gY3QuX2xlYWZsZXRfaWQpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jdHNba107XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHRtcEN0ID0gdGhpcy5jdHNbY3RdO1xuICAgICAgaWYgKHRtcEN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgVC5tYXAucmVtb3ZlQ29udHJvbCh0bXBDdCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmN0c1tjdF07XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBoaWRlOiBmdW5jdGlvbiAoY3QpIHtcbiAgICBjdC5oaWRlKCk7XG4gIH0sXG4gIHNob3c6IGZ1bmN0aW9uIChjdCkge1xuICAgIGN0LnNob3coKTtcbiAgfSxcbiAgaGlkZUFsbDogZnVuY3Rpb24gKCkge1xuICAgIGZvciAobGV0IGsgaW4gdGhpcy5jdHMpIHtcbiAgICAgIHRoaXMuY3RzW2tdLmhpZGUoKTtcbiAgICB9XG4gIH0sXG4gIHNob3dBbGw6IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCBrIGluIHRoaXMuY3RzKSB7XG4gICAgICB0aGlzLmN0c1trXS5zaG93KCk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb250cm9scztcbiIsImltcG9ydCBNYXBPcHRpb24gZnJvbSAnLi4vY29tcG9uZW50L01hcE9wdGlvbic7XG5pbXBvcnQge3JlY3RhbmdsZX0gZnJvbSAnLi4vY29tcG9uZW50L1RSZWN0YW5nbGUnO1xuaW1wb3J0IHtjaXJjbGV9IGZyb20gJy4uL2NvbXBvbmVudC9UQ2lyY2xlJztcbmltcG9ydCB7cG9seWxpbmV9IGZyb20gJy4uL2NvbXBvbmVudC9UUG9seWxpbmUnO1xuaW1wb3J0IHtjaXJjbGVNYXJrZXJ9IGZyb20gJy4uL2NvbXBvbmVudC9UQ2lyY2xlTWFya2VyJztcbmltcG9ydCB7cG9seWdvbn0gZnJvbSAnLi4vY29tcG9uZW50L1RQb2x5Z29uJztcbmltcG9ydCBjb250cm9scyBmcm9tICcuL0NvbnRyb2xNYW5hZ2VyJztcblxubGV0IFQgPSBuZXcgUHJveHkoe1xuICBtYXA6IG51bGwsXG4gIHJlY3RhbmdsZTogcmVjdGFuZ2xlLFxuICBjaXJjbGU6IGNpcmNsZSxcbiAgY2lyY2xlTWFya2VyOiBjaXJjbGVNYXJrZXIsXG4gIG1hcmtlcjogbnVsbCxcbiAgcG9seWxpbmU6IHBvbHlsaW5lLFxuICBwb2x5Z29uOiBwb2x5Z29uLFxuICBjb250cm9sczogY29udHJvbHNcblxufSwge30pO1xuVC5jcmVhdGVNYXAgPSBmdW5jdGlvbiAoZG9tKSB7XG4gIFQubWFwID0gTC5tYXAoZG9tLCBNYXBPcHRpb24pO1xuICBULmNvbnRyb2xzLmluaXQoKTtcbiAgcmV0dXJuIFQubWFwO1xufTtcblQubWFya2VyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgVDtcblxuXG4iLCJpbXBvcnQgVCBmcm9tICcuL2NvcmUvVE1hcCc7XG5cbndpbmRvdy5UID0gVDtcblQuY3JlYXRlTWFwKCdtYXAnKTtcbkwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZz97Zm9vfScsIHtmb286ICdiYXInfSkuYWRkVG8oVC5tYXApO1xudmFyIGJvdW5kcyA9IFtbNTQuNTU5MzIyLCAyMC43Njc4MjJdLCBbNTYuMTIxMDYwNCwgMzMuMDIxMjQwXV07XG4vLyBjcmVhdGUgYW4gb3JhbmdlIHJlY3RhbmdsZVxubGV0IHMgPSBULnJlY3RhbmdsZShib3VuZHMsIHtjb2xvcjogJyNmZjc4MDAnLCB3ZWlnaHQ6IDF9KS5hZGRUbyhULm1hcCk7XG53aW5kb3cucyA9IHM7XG4vLyB6b29tIHRoZSBtYXAgdG8gdGhlIHJlY3RhbmdsZSBib3VuZHNcblQubWFwLmZpdEJvdW5kcyhib3VuZHMpO1xuVC5tYXAuYWRkQ29udHJvbChULmNvbnRyb2xzLnpvb20oKSk7XG5jb25zb2xlLmxvZyhzKTtcbmNvbnNvbGUubG9nKFQpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==