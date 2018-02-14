'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LeftRow = require('./LeftRow.js');

var _LeftRow2 = _interopRequireDefault(_LeftRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LeftPanel = function (_React$Component) {
    _inherits(LeftPanel, _React$Component);

    function LeftPanel(props) {
        _classCallCheck(this, LeftPanel);

        var _this = _possibleConstructorReturn(this, (LeftPanel.__proto__ || Object.getPrototypeOf(LeftPanel)).call(this, props));

        var store = _this.props.store;
        var view = store.state.view;

        var getPosts = function getPosts(view) {
            return view == 'hot' ? store.state.hot : store.state.favorites;
        };

        _this.state = { posts: getPosts(view) };

        _this.props.store.addListener(function (x) {
            var view = store.state.view;

            _this.setState({ posts: getPosts(view) });
        });
        return _this;
    }

    _createClass(LeftPanel, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var store = this.props.store;

            return _react2.default.createElement(
                'div',
                { className: 'left-panel' },
                this.state.posts.map(function (post) {
                    return _react2.default.createElement(_LeftRow2.default, { key: post.id, post: post, store: _this2.props.store });
                })
            );
        }
    }]);

    return LeftPanel;
}(_react2.default.Component);

exports.default = LeftPanel;