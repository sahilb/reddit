"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Html = function Html(props) {
    return _react2.default.createElement(
        "html",
        null,
        _react2.default.createElement(
            "head",
            null,
            _react2.default.createElement(
                "title",
                null,
                "App"
            )
        ),
        _react2.default.createElement(
            "body",
            null,
            _react2.default.createElement(
                "div",
                { id: "app" },
                props.children
            ),
            _react2.default.createElement("script", { id: "initial-data", type: "text/plain", "data-json": props.fruits }),
            _react2.default.createElement("script", { src: "/bundle.js" })
        )
    );
};

exports.default = Html;