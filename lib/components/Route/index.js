"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _RouterContext = _interopRequireDefault(require("../RouterContext"));

var _RouteCore = _interopRequireDefault(require("../RouteCore"));

var _reducer = require("../../core/redux/reducer");

var _router = require("../../core/router");

var _nuomi = require("../../core/nuomi");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Route =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Route, _React$PureComponent);

  function Route() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Route);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Route)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.store = {};
    _this.routeTempData = {};
    _this.ref = _react.default.createRef();
    var path = _this.props.path;
    (0, _router.savePath)(path);
    return _this;
  }

  _createClass(Route, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        routeTempData: this.routeTempData
      };
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props = this.props,
          path = _this$props.path,
          wrapper = _this$props.wrapper;
      var current = this.ref.current;

      if (current) {
        if (wrapper) {
          current.removeWrapper();
        }

        if (current.ref.current) {
          current.ref.current.removeListener();
        }
      }

      (0, _router.removePath)(path);
      (0, _reducer.removeReducer)(this.store.id);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var defaultProps = (0, _nuomi.getDefaultProps)();
      var _this$props2 = this.props,
          path = _this$props2.path,
          _this$props2$wrapper = _this$props2.wrapper,
          wrapper = _this$props2$wrapper === void 0 ? defaultProps.wrapper : _this$props2$wrapper;
      return _react.default.createElement(_RouterContext.default.Consumer, null, function (context) {
        var location = context.location;
        var match = (0, _router.matchPath)(location, path); // context.matched 表示同一个上下文中，多个路由只匹配一个

        if (context.matched && context.matched !== _this2) {
          match = false;
        } // 设置了wrapper没有匹配路由，不销毁，只隐藏


        if (wrapper === true && _this2.routeCore && !match) {
          return _this2.routeCore;
        }

        if (match) {
          // eslint-disable-next-line no-param-reassign
          context.matched = _this2; // 解决Route在更新时不匹配问题，值不能设置为true

          location.params = (0, _router.getParams)(location, path); // 解析动态参数

          _this2.routeCore = _react.default.createElement(_RouteCore.default, _extends({}, _this2.props, {
            wrapper: wrapper,
            location: location,
            store: _this2.store,
            ref: _this2.ref
          }));
          return _this2.routeCore;
        }

        return null;
      });
    }
  }]);

  return Route;
}(_react.default.PureComponent);

_defineProperty(Route, "propTypes", {
  path: _propTypes.default.string,
  wrapper: _propTypes.default.bool
});

_defineProperty(Route, "childContextTypes", {
  routeTempData: _propTypes.default.object
});

var _default = Route;
exports.default = _default;