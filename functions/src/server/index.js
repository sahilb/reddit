'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _html = require('./../html');

var _html2 = _interopRequireDefault(_html);

var _signin_app = require('./../views/signin_app');

var _signin_app2 = _interopRequireDefault(_signin_app);

var _HomePage = require('./../views/HomePage');

var _HomePage2 = _interopRequireDefault(_HomePage);

var _Post = require('./Post');

var _Post2 = _interopRequireDefault(_Post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Account = require('./account');

var favicon = require('serve-favicon');

var log = console.log.bind(console);

var app = (0, _express2.default)();

app.use((0, _morgan2.default)('dev'));

app.use((0, _cookieParser2.default)());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(_express2.default.static('./public/'));

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

_mongoose2.default.connect('mongodb://localhost/login_auth');

app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

var authenticateUser = function authenticateUser(req, res, cb) {
    passport.authenticate('local')(req, res, cb);
};

app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/homepage');
        return;
    }
    var initialState = {
        view: 'login',
        title: 'Sign in',
        otherTitle: 'Create Account',
        otherUri: '/register',
        uri: 'login'
    };
    _server2.default.renderToNodeStream(_react2.default.createElement(
        _html2.default,
        { initialState: JSON.stringify(initialState) },
        _react2.default.createElement(_signin_app2.default, initialState)
    )).pipe(res);
});

app.post('/login', function (req, res) {
    authenticateUser(req, res, function () {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: true, serverMessage: '' }));
    });
});

app.get('/register', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/homepage');
        return;
    }
    var initialState = {
        view: 'register',
        title: 'Create Account',
        otherTitle: 'Existing User',
        otherUri: '/login',
        uri: 'register'
    };
    _server2.default.renderToNodeStream(_react2.default.createElement(
        _html2.default,
        { initialState: JSON.stringify(initialState) },
        _react2.default.createElement(_signin_app2.default, initialState)
    )).pipe(res);
});

app.post('/register', function (req, res) {
    var _req$query = req.query,
        username = _req$query.username,
        password = _req$query.password;


    Account.register(new Account({ username: username }), password, function (err, account) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            // return res.render('register', { account : account });
            return res.send(JSON.stringify({ success: false, serverMessage: err.message }));
        }

        passport.authenticate('local')(req, res, function () {
            // res.redirect('/homepage');
            res.send(JSON.stringify({ success: true, serverMessage: '' }));
        });
    });
});

app.get('/homepage', function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    getRedditData(req.user.id, function (err, json) {
        var initialState = {
            view: 'homepage',
            hot: json.hot,
            fav: json.fav
        };
        _server2.default.renderToNodeStream(_react2.default.createElement(_html2.default, { initialState: JSON.stringify(initialState) })).pipe(res);
    });
});

app.post('/updatePost', function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    var _req$query2 = req.query,
        enable = _req$query2.enable,
        name = _req$query2.name;

    var userId = req.user.id;
    if (enable == 'true') {
        var post = new _Post2.default({ name: name, userId: userId });
        post.save(function (err) {
            err && log('error in saving ', err);
            res.send(JSON.stringify({ success: true, serverMessage: '' }));
        });
    } else {
        _Post2.default.remove({ name: name, userId: userId }, function (err) {
            err && log('error in removing ', err);
            res.send(JSON.stringify({ success: true, serverMessage: '' }));
        });
    }
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

app.get('**', function (req, res) {
    res.redirect('/homepage');
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    return console.log('listening on port ' + PORT);
});

function getRedditData(userId, cb) {

    _Post2.default.find({ userId: userId }).exec(function (x, posts) {

        var getByIds = void 0;

        if (posts.length) {
            var s = new Set();
            posts.map(function (post) {
                return s.add(post.name);
            });
            var names = [].concat(_toConsumableArray(s)).join(',');
            var idsUrl = 'https://www.reddit.com/by_id/' + names + '.json';
            getByIds = getFromRedditApi(idsUrl);
        } else {
            getByIds = Promise.resolve({});
        }

        var hotUrl = 'https://www.reddit.com/hot.json';
        var getHot = getHotPosts(hotUrl);

        Promise.all([getHot, getByIds]).then(function (result) {
            var _result = _slicedToArray(result, 2),
                hot = _result[0],
                fav = _result[1];

            cb(null, {
                hot: hot,
                fav: fav
            });
        }).catch(function (e) {
            console.log('error in getting server data', e);
            cb(null, {
                hot: {},
                fav: {}
            });
        });
    });
}
function getHotPosts(url) {
    return readFromFile().catch(function (e) {
        return getFromRedditApi(url).then(function (json) {
            return saveToFile(json);
        });
    });
}

function getFromRedditApi(url) {
    return new Promise(function (resolve, reject) {

        _https2.default.get(url, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                var json = JSON.parse(body);
                resolve(json);
            });
        }).on('error', function (e) {
            console.log("Got an error: ", e);
            reject(e);
        });
    });
}

function saveToFile(data) {
    var file = 'hot1.json';

    return Promise.resolve().then(function () {
        _fs2.default.writeFileSync(file, JSON.stringify(data));
        return Promise.resolve(data);
    });
}

function readFromFile() {
    var file = 'hot1.json';
    return new Promise(function (resolve, reject) {
        _fs2.default.stat(file, function (err, f) {
            if (err) {
                reject(err);
            } else {
                var mtime = f.mtime;

                var now = new Date();
                if (now.getTime() - mtime.getTime() < 200000) {

                    try {
                        var contents = _fs2.default.readFileSync(file).toString();
                        contents = JSON.parse(contents);
                        resolve(contents);
                    } catch (e) {
                        reject({});
                    }
                } else {
                    reject({});
                }
            }
        });
    });
}