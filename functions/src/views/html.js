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
            _react2.default.createElement("meta", { charSet: "utf-8" }),
            _react2.default.createElement(
                "title",
                null,
                "MyReddit"
            ),
            _react2.default.createElement("link", { rel: "stylesheet",
                href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
                integrity: "sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u",
                crossOrigin: "anonymous"
            }),
            _react2.default.createElement("link", { rel: "stylesheet",
                href: "styles.css"
            })
        ),
        _react2.default.createElement(
            "body",
            null,
            _react2.default.createElement(
                "div",
                { id: "app" },
                props.children
            ),
            _react2.default.createElement("script", { id: "initial-data", type: "text/plain", "data-json": props.initialState }),
            _react2.default.createElement("script", { src: "/bundle.js" })
        )
    );
};

exports.default = Html;