"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _BaseNuomi = _interopRequireDefault(require("../BaseNuomi"));

var _reducer = require("../../core/redux/reducer");

var _nuomi = require("../../core/nuomi");

var _utils = require("../../utils");

var _extend = _interopRequireDefault(require("../../utils/extend"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Nuomi =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(Nuomi, _React$PureComponent);

  function Nuomi() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Nuomi);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Nuomi)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.ref = _react.default.createRef();
    _this.mounted = false;
    _this.store = {};

    var _this$props = _this.props,
        async = _this$props.async,
        rest = _objectWithoutProperties(_this$props, ["async"]);

    var isAsync = (0, _utils.isFunction)(async);
    _this.state = {
      loaded: !isAsync,
      nuomiProps: (0, _extend.default)((0, _nuomi.getDefaultProps)(), rest)
    };
    return _this;
  }

  _createClass(Nuomi, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
      this.loadProps();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
      (0, _reducer.removeReducer)(this.store.id);

      if (this.ref.current) {
        this.ref.current.removeListener();
      }
    }
  }, {
    key: "loaded",
    value: function loaded(props) {
      var nuomiProps = this.state.nuomiProps;

      if (this.mounted === true) {
        this.setState({
          loaded: true,
          nuomiProps: (0, _extend.default)(nuomiProps, props)
        });
      }
    }
  }, {
    key: "loadProps",
    value: function loadProps() {
      var _this2 = this;

      var async = this.props.async;
      var loaded = this.state.loaded;

      if (!loaded) {
        var loadResult = async(function (props) {
          _this2.loaded(props);
        });

        if (loadResult && loadResult instanceof Promise) {
          loadResult.then(function (module) {
            return _this2.loaded(module.default);
          });
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          loaded = _this$state.loaded,
          nuomiProps = _this$state.nuomiProps;

      if (loaded) {
        return _react.default.createElement(_BaseNuomi.default, _extends({
          ref: this.ref
        }, nuomiProps, {
          store: this.store
        }));
      }

      return null;
    }
  }]);

  return Nuomi;
}(_react.default.PureComponent);

var _default = Nuomi;
exports.default = _default;