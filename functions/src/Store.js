'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xhr = require('xhr');

var _xhr2 = _interopRequireDefault(_xhr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store(hot, favorites) {
        _classCallCheck(this, Store);

        var hotPosts = this.filter(hot && hot.data ? hot.data.children : []);
        var favoritePosts = this.filter(favorites && favorites.data ? favorites.data.children : [], true);
        favoritePosts.forEach(function (p) {
            var pHot = hotPosts.find(function (post) {
                return post.id == p.id;
            });
            if (pHot) {
                pHot.isFavorite = true;
            }
        });

        this.state = {
            view: 'hot', // | favorites
            favorites: favoritePosts,
            hot: hotPosts,
            activeHotPost: hotPosts[0],
            activeFavoritePost: favoritePosts && favoritePosts.length ? favoritePosts[0] : undefined,
            isLoggedIn: true
        };

        this.listeners = [];
        this.actions = {};
        this.bindActions();
    }

    _createClass(Store, [{
        key: 'addListener',
        value: function addListener(listener) {
            this.listeners.push(listener);
        }
    }, {
        key: 'notify',
        value: function notify() {
            var _this = this;

            this.listeners.forEach(function (listener) {
                return listener(_this);
            });
        }
    }, {
        key: 'filter',
        value: function filter(jsonPosts, isFavorite) {
            return jsonPosts.map(function (post, i) {
                var data = post.data;
                var id = data.id,
                    num_comments = data.num_comments,
                    title = data.title,
                    url = data.url,
                    permalink = data.permalink,
                    thumbnail = data.thumbnail,
                    thumbnail_height = data.thumbnail_height,
                    thumbnail_width = data.thumbnail_width,
                    preview = data.preview,
                    media = data.media,
                    name = data.name;

                isFavorite = !!isFavorite;
                var image = '';
                var video = '';
                var source = '';
                var previewType = '';
                var previewUrl = '';
                try {
                    source = data.preview.images[0].variants.mp4 ? data.preview.images[0].variants.mp4.source.url : '';
                } catch (e) {}

                try {
                    video = data.media.reddit_video.fallback_url;
                } catch (e) {}

                try {
                    image = data.preview.images[0].source.url;
                } catch (e) {}

                if (source) {
                    source = source.replace(/amp;/g, '');
                    previewType = 'video';
                    previewUrl = source;
                } else if (video) {
                    previewType = 'video';
                    previewUrl = video;
                } else {
                    previewType = 'image';
                    if (image.length == 0) {
                        previewUrl = './no-preview.jpg';
                    } else {
                        previewUrl = image;
                    }
                }

                return {
                    id: id, num_comments: num_comments, title: title,
                    url: url, permalink: permalink, thumbnail: thumbnail, thumbnail_height: thumbnail_height, thumbnail_width: thumbnail_width,
                    isFavorite: isFavorite, previewUrl: previewUrl, previewType: previewType, name: name
                };
            });
        }
    }, {
        key: 'bindActions',
        value: function bindActions() {
            var _this2 = this;

            var enablePost = function enablePost(post) {
                if (_this2.state.view == 'hot') {
                    _this2.state.activeHotPost = post;
                } else {
                    _this2.state.activeFavoritePost = post;
                }
                _this2.notify();
            };

            var clickHome = function clickHome() {
                if (_this2.state.view == 'hot') {
                    return;
                }
                _this2.state.view = 'hot';
                _this2.notify();
            };

            var clickFavorites = function clickFavorites() {
                if (_this2.state.view == 'favorites') {
                    return;
                }
                _this2.state.view = 'favorites';
                _this2.notify();
            };

            var addToFavorites = function addToFavorites(post) {
                var x = _this2.state.hot.filter(function (p) {
                    return p.id === post.id;
                });
                if (x.length) {
                    x[0].isFavorite = true;
                }
                _this2.state.favorites.push(post);
                _this2.notify();
                _this2.sendToServer(post.name, true, function () {});
            };
            var removeFromFavorites = function removeFromFavorites(post) {
                var x = _this2.state.hot.filter(function (p) {
                    return p.id === post.id;
                });
                if (x.length) {
                    x[0].isFavorite = false;
                }
                var activeFavoritePost = _this2.state.activeFavoritePost;

                if (activeFavoritePost && activeFavoritePost.id == post.id) {
                    _this2.state.activeFavoritePost = undefined;
                }
                _this2.state.favorites = _this2.state.favorites.filter(function (p) {
                    return p.id !== post.id;
                });
                _this2.notify();
                _this2.sendToServer(post.name, false, function () {});
            };

            this.actions.enablePost = enablePost.bind(this);
            this.actions.clickHome = clickHome.bind(this);
            this.actions.clickFavorites = clickFavorites.bind(this);
            this.actions.addToFavorites = addToFavorites.bind(this);
            this.actions.removeFromFavorites = removeFromFavorites.bind(this);
        }
    }, {
        key: 'sendToServer',
        value: function sendToServer(postId, fav, callback) {
            (0, _xhr2.default)({
                method: 'post',
                uri: '/updatePost?name=' + postId + '&enable=' + fav,
                headers: { 'Content-Type': 'application/json' }
            }, callback);
        }
    }]);

    return Store;
}();

exports.default = Store;