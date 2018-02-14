'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Media = require('./Media.js');

var _Media2 = _interopRequireDefault(_Media);

var _Title = require('./Title.js');

var _Title2 = _interopRequireDefault(_Title);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RightPanel = function (_React$Component) {
    _inherits(RightPanel, _React$Component);

    function RightPanel(props) {
        _classCallCheck(this, RightPanel);

        return _possibleConstructorReturn(this, (RightPanel.__proto__ || Object.getPrototypeOf(RightPanel)).call(this, props));
    }

    _createClass(RightPanel, [{
        key: 'render',
        value: function render() {
            var post = this.props.post;

            if (!post) {
                return _react2.default.createElement('div', { className: 'right-panel' });
            }
            return _react2.default.createElement(
                'div',
                { className: 'right-panel' },
                _react2.default.createElement(
                    _Title2.default,
                    { post: post },
                    ' '
                ),
                _react2.default.createElement(
                    _Media2.default,
                    { post: post },
                    ' '
                )
            );
        }
    }]);

    return RightPanel;
}(_react2.default.Component);

exports.default = RightPanel;