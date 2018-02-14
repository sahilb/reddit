'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _app = require('./views/app.js');

var _app2 = _interopRequireDefault(_app);

var _signin_app = require('./views/signin_app');

var _signin_app2 = _interopRequireDefault(_signin_app);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));

var view = initialData.view;

if (view === 'login' || view === 'register') {

    _reactDom2.default.hydrate(_react2.default.createElement(_signin_app2.default, initialData), document.querySelector('#app'));
} else {
    _reactDom2.default.hydrate(_react2.default.createElement(_app2.default, initialData), document.querySelector('#app'));
}