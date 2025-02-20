"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _proxyPolyfill = _interopRequireDefault(require("./proxyPolyfill"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var supportProxy = (0, _index.isNative)(window.Proxy);
var EffectsProxy = supportProxy ? window.Proxy : (0, _proxyPolyfill.default)();

var getEffects = function getEffects(effects) {
  if (!supportProxy) {
    var _ret = function () {
      var propertys = {};

      var setPropertys = function setPropertys(key, value) {
        if (key !== 'constructor' && !propertys[key]) {
          propertys[key] = value;
        }
      };

      var object = effects;

      var _loop = function _loop() {
        var prototype = Object.getPrototypeOf(object);
        var entries = Object.entries(object);
        var propertyNames = Object.getOwnPropertyNames(prototype);

        if (prototype.constructor === Object) {
          return "break";
        }

        object = prototype;
        entries.forEach(function (data) {
          var _data = _slicedToArray(data, 2),
              name = _data[0],
              value = _data[1];

          setPropertys(name, value);
        });
        propertyNames.forEach(function (key) {
          setPropertys(key, prototype[key]);
        });
      };

      while (object.constructor !== Object) {
        var _ret2 = _loop();

        if (_ret2 === "break") break;
      }

      return {
        v: propertys
      };
    }();

    if (_typeof(_ret) === "object") return _ret.v;
  }

  return effects;
};

var _default = function _default(effects, handler) {
  return new EffectsProxy(effects.constructor === Object ? effects : getEffects(effects), handler);
};

exports.default = _default;