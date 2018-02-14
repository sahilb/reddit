'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store(json) {
        _classCallCheck(this, Store);

        var posts = this.filter(json);

        this.state = {
            view: 'hot', // | favorites
            posts: posts,
            activeHotPost: posts[0],
            activeFavoritePost: undefined,
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
        value: function filter(json) {
            return json.data.children.map(function (post, i) {
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
                    media = data.media;

                var isFavorite = i % 5 == 0;

                var image = '';
                var video = '';
                var source = '';
                var previewType = '';
                var previewUrl = '';

                try {
                    source = post.preview.images[0].variants.mp4 ? post.preview.images[0].variants.mp4.source.url : '';
                    image = post.preview.images[0].source.url;
                    video = post.media.reddit_video.fallback_url;
                } catch (e) {
                    image = image || '';
                    video = video || '';
                }
                if (source.length) {
                    source = source.replace(/amp;/g, '');
                    previewType = 'video';
                    previewUrl = source;
                } else if (video.length) {
                    previewType = 'video';
                    previewUrl = video;
                } else {
                    previewType = 'image';
                    if (image.length == 0) {
                        previewUrl = './no-preview.jpg';
                    }
                }

                return {
                    id: id, num_comments: num_comments, title: title,
                    url: url, permalink: permalink, thumbnail: thumbnail, thumbnail_height: thumbnail_height, thumbnail_width: thumbnail_width,
                    isFavorite: isFavorite, previewUrl: previewUrl, previewType: previewType
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
                var p = _this2.state.posts.filter(function (x) {
                    return x == post;
                })[0];
                p.isFavorite = true;
                _this2.notify();
                // send network request
            };
            var removeFromFavorites = function removeFromFavorites(post) {
                var p = _this2.state.posts.filter(function (x) {
                    return x == post;
                })[0];
                p.isFavorite = false;
                _this2.notify();
            };

            this.actions.enablePost = enablePost.bind(this);
            this.actions.clickHome = clickHome.bind(this);
            this.actions.clickFavorites = clickFavorites.bind(this);
            this.actions.addToFavorites = addToFavorites.bind(this);
            this.actions.removeFromFavorites = removeFromFavorites.bind(this);
        }
    }]);

    return Store;
}();

exports.default = Store;