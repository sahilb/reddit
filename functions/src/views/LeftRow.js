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

var LeftRow = function (_React$Component) {
    _inherits(LeftRow, _React$Component);

    function LeftRow(props) {
        _classCallCheck(this, LeftRow);

        var _this = _possibleConstructorReturn(this, (LeftRow.__proto__ || Object.getPrototypeOf(LeftRow)).call(this, props));

        var _this$props = _this.props,
            store = _this$props.store,
            post = _this$props.post;

        _this.state = {
            isFavorite: post.isFavorite
        };
        store.addListener(function () {
            var view = store.state.view;

            var getPosts = function getPosts(view) {
                return view == 'hot' ? store.state.hot : store.state.favorites;
            };

            var p = getPosts(view).filter(function (x) {
                return x.id === post.id;
            });
            if (p.length) {
                _this.setState({
                    isFavorite: p[0].isFavorite
                });
            }
        });
        return _this;
    }

    _createClass(LeftRow, [{
        key: 'onRowClicked',
        value: function onRowClicked(ev) {
            if (ev.target.className.startsWith('favorite-icon')) {
                return;
            }
            this.props.store.actions.enablePost(this.props.post);
        }
    }, {
        key: 'splitTitle',
        value: function splitTitle() {
            var title = this.props.post.title;
            var max = 41;
            if (title.length > max) {
                title = title.slice(0, max);
                title = title + '...';
            }
            return title;
        }
    }, {
        key: 'getDimensions',
        value: function getDimensions(post) {
            var height = 54;
            var width = 54;
            if (!post.thumbnail || post.thumbnail == 'self' || post.thumbnail == 'default') {
                post.thumbnail = './reddit_logo.png';
                height = 54;
                width = 54;
            } else if (post.thumbnail && post.thumbnail_height && post.thumbnail_height >= 58) {
                height = 54;
                width = 54;
            } else {
                height = post.thumbnail_height || 54;
                width = post.thumbnail_width || 54;
            }

            return { height: height, width: width };
        }
    }, {
        key: 'onFavoriteToggled',
        value: function onFavoriteToggled(ev) {
            var _props = this.props,
                post = _props.post,
                store = _props.store;

            if (this.state.isFavorite) {
                store.actions.removeFromFavorites(post);
            } else {
                store.actions.addToFavorites(post);
            }
        }
    }, {
        key: 'isActive',
        value: function isActive() {
            var store = this.props.store;
            var state = store.state;

            var activePost = state.view == 'hot' ? state.activeHotPost : state.activeFavoritePost;
            return activePost === this.props.post;
        }
    }, {
        key: 'render',
        value: function render() {
            var post = this.props.post;

            var url = "https://www.reddit.com" + post.permalink;

            var _getDimensions = this.getDimensions(post),
                height = _getDimensions.height,
                width = _getDimensions.width;

            var favClassName = (this.state.isFavorite ? 'favorite-icon-enabled' : 'favorite-icon') + ' row-section';

            var rowClassName = 'left-row ' + (this.isActive() ? 'active-row' : '');

            return _react2.default.createElement(
                'div',
                { className: rowClassName, key: post.id, onClick: this.onRowClicked.bind(this) },
                _react2.default.createElement(
                    'div',
                    { className: 'thumbnail row-section' },
                    _react2.default.createElement('img', { alt: 'thumbnail', src: post.thumbnail, height: height, width: width })
                ),
                _react2.default.createElement('div', { className: favClassName, onClick: this.onFavoriteToggled.bind(this) }),
                _react2.default.createElement(
                    'div',
                    { className: 'row-section' },
                    _react2.default.createElement(
                        'div',
                        { className: 'title' },
                        _react2.default.createElement(
                            'div',
                            null,
                            this.splitTitle()
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'comments' },
                        post.num_comments,
                        ' comments'
                    )
                )
            );
        }
    }]);

    return LeftRow;
}(_react2.default.Component);

exports.default = LeftRow;