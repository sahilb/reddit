'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _xhr = require('xhr');

var _xhr2 = _interopRequireDefault(_xhr);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignInApp = function (_React$Component) {
    _inherits(SignInApp, _React$Component);

    function SignInApp(props) {
        _classCallCheck(this, SignInApp);

        var _this = _possibleConstructorReturn(this, (SignInApp.__proto__ || Object.getPrototypeOf(SignInApp)).call(this, props));

        _this.state = {
            invalid: {},
            username: '',
            password: '',
            submitAttempts: 0
        };
        return _this;
    }

    _createClass(SignInApp, [{
        key: 'handleUserNameChange',
        value: function handleUserNameChange(ev) {
            var val = ev.target.value;
            this.setState({
                username: val
            });
        }
    }, {
        key: 'handleUserPasswordChange',
        value: function handleUserPasswordChange(ev) {
            var val = ev.target.value;
            this.setState({
                password: val
            });
        }
    }, {
        key: 'onClick',
        value: function onClick() {
            console.log('clicked');
        }
    }, {
        key: 'validate',
        value: function validate() {
            var _state = this.state,
                username = _state.username,
                password = _state.password,
                submitAttempts = _state.submitAttempts;

            if (submitAttempts == 0) {
                return;
            }
            if (!username.length && !password.length) {
                this.setState({ invalid: { username: true, password: true } });
            } else if (!username.length) {
                this.setState({ invalid: { username: true, password: false } });
            } else if (!password.length) {
                this.setState({ invalid: { username: false, password: true } });
            } else {
                this.setState({ invalid: { username: false, password: false } });
                return true;
            }
        }
    }, {
        key: 'submit',
        value: function submit() {
            var _this2 = this;

            console.log('submitting');
            var submitAttempts = this.state.submitAttempts;

            this.setState({
                submitAttempts: submitAttempts + 1
            }, function () {
                if (_this2.validate()) {
                    var callback = function callback(err, resp, json) {
                        if (resp && resp.statusCode == 401) {
                            _this2.setState({
                                serverMessage: 'Invalid Credentials'
                            });
                            return;
                        }
                        if (err) {
                            _this2.setState({
                                serverMessage: err
                            });
                            return;
                        }
                        var success = json.success,
                            serverMessage = json.serverMessage;

                        if (success) {
                            window.location.href = window.location.origin + '/homepage';
                        } else {
                            _this2.setState({
                                serverMessage: serverMessage
                            });
                        }
                    };
                    var _state2 = _this2.state,
                        username = _state2.username,
                        password = _state2.password;

                    (0, _xhr2.default)({
                        method: 'post',
                        body: JSON.stringify({ username: username, password: password }),
                        uri: '/' + _this2.props.uri + '?' + 'username=' + _this2.state.username + '&' + 'password=' + _this2.state.password,
                        headers: { 'Content-Type': 'application/json' },
                        json: true
                    }, callback);
                } else {
                    return false;
                }
            });
        }
    }, {
        key: 'handleKeyUp',
        value: function handleKeyUp(ev) {
            var keyCode = ev.keyCode;

            this.validate();
            if (keyCode == 13) {
                this.submit();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var defaultClass = 'row form-control';
            var usernameClassName = defaultClass + (this.state.invalid.username ? ' invalid' : '');
            var passwordClassName = defaultClass + (this.state.invalid.password ? ' invalid' : '');

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_Header2.default, { otherUri: this.props.otherUri, otherTitle: this.props.otherTitle }),
                _react2.default.createElement(
                    'div',
                    { className: 'jumbotron signin' },
                    _react2.default.createElement(
                        'form',
                        { className: 'form-signin' },
                        _react2.default.createElement(
                            'label',
                            { htmlFor: 'userName', className: 'sr-only' },
                            'User Name'
                        ),
                        _react2.default.createElement('input', { type: 'name', name: 'username', id: 'username', placeholder: 'User Name', autoFocus: true,
                            className: usernameClassName,
                            onKeyUp: this.handleKeyUp.bind(this),
                            onChange: this.handleUserNameChange.bind(this)
                        }),
                        _react2.default.createElement('input', { type: 'password', name: 'password', id: 'password',
                            className: passwordClassName, placeholder: 'Password',
                            onKeyUp: this.handleKeyUp.bind(this),
                            onChange: this.handleUserPasswordChange.bind(this)
                        }),
                        _react2.default.createElement(
                            'button',
                            { id: 'btnSignUp', className: 'row row-btn btn btn-lg btn-primary btn-block',
                                type: 'button',
                                onClick: this.submit.bind(this)
                            },
                            this.props.title
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'serverMessage row' },
                            this.state.serverMessage
                        )
                    )
                )
            );
        }
    }]);

    return SignInApp;
}(_react2.default.Component);

exports.default = SignInApp;