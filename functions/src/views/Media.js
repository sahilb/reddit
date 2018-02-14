'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Media = function (_React$Component) {
    _inherits(Media, _React$Component);

    function Media() {
        _classCallCheck(this, Media);

        return _possibleConstructorReturn(this, (Media.__proto__ || Object.getPrototypeOf(Media)).apply(this, arguments));
    }

    _createClass(Media, [{
        key: 'extractUrl',
        value: function extractUrl() {
            var post = this.props.post;

            var image = '';
            var video = '';
            var source = '';
            try {
                source = post.preview.images[0].variants.mp4 ? post.preview.images[0].variants.mp4.source.url : '';
                image = post.preview.images[0].source.url;
                video = post.media.reddit_video.fallback_url;
            } catch (e) {
                image = image || '';
                video = video || '';
            }

            var media = video.length ? video : image;

            if (source.length) {
                source = source.replace(/amp;/g, '');
            }
            if (image.length == 0) {
                image = './no-preview.jpg';
            }
            return {
                source: source, video: video, image: image
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$post = this.props.post,
                previewType = _props$post.previewType,
                previewUrl = _props$post.previewUrl;
            var width = 640,
                height = 480;

            return _react2.default.createElement(
                'div',
                { className: 'media' },
                previewType == 'video' ? _react2.default.createElement('video', { src: previewUrl, height: height, width: width, loop: 'loop', controls: true, muted: true }) : _react2.default.createElement('img', { height: height, width: width, src: previewUrl })
            );
        }
    }]);

    return Media;
}(_react2.default.Component);

exports.default = Media;