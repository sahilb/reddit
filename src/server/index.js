import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactDOMServer from 'react-dom/server';
import express from 'express';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import https from 'https';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Account = require('./account');

var favicon = require('serve-favicon');

import Html from './../html'
import SignInApp from './../views/signin_app'

import Homepage from './../views/HomePage'
import Post from './Post';

const log = console.log.bind(console);

const app = express();

app.use(logger('dev'));

app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./public/'));

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect('mongodb://localhost/login_auth');

app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


const authenticateUser = (req, res, cb) => {
    passport.authenticate('local')(req, res, cb)
};


app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/homepage');
        return;
    }
    const initialState = {
        view: 'login',
        title: 'Sign in',
        otherTitle: 'Create Account',
        otherUri: '/register',
        uri: 'login'
    }
    ReactDOMServer.renderToNodeStream(
        <Html initialState={JSON.stringify(initialState)}>
            <SignInApp {...initialState} />
        </Html>
    ).pipe(res);
})

app.post('/login', function (req, res) {
    authenticateUser(req, res, () => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ success: true, serverMessage: '' }));
    })
});


app.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/homepage');
        return;
    }
    const initialState = {
        view: 'register',
        title: 'Create Account',
        otherTitle: 'Existing User',
        otherUri: '/login',
        uri: 'register'
    }
    ReactDOMServer.renderToNodeStream(
        <Html initialState={JSON.stringify(initialState)}>
            <SignInApp {...initialState} />
        </Html>
    ).pipe(res);

})

app.post('/register', (req, res) => {

    const { username, password } = req.query

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


})


app.get('/homepage', (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    getRedditData(req.user.id, (err, json) => {
        const initialState = {
            view: 'homepage',
            hot: json.hot,
            fav: json.fav
        }
        ReactDOMServer.renderToNodeStream(
            <Html initialState={JSON.stringify(initialState)}>
            </Html>
        ).pipe(res);
    });
})

app.post('/updatePost', (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
    }

    const { enable, name } = req.query;
    const userId = req.user.id;
    if (enable == 'true') {
        var post = new Post({ name, userId });
        post.save((err) => {
            err && log('error in saving ', err);
            res.send(JSON.stringify({ success: true, serverMessage: '' }));
        });
    } else {
        Post.remove({ name, userId }, (err) => {
            err && log('error in removing ', err);
            res.send(JSON.stringify({ success: true, serverMessage: '' }));
        })
    }

})

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login')
})

app.get('**', (req, res) => {
    res.redirect('/homepage');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening on port ' + PORT));


function getRedditData(userId, cb) {

    Post.find({ userId: userId }).exec((x, posts) => {

        let getByIds

        if (posts.length) {
            let s = new Set();
            posts.map(post => s.add(post.name));
            const names = [...s].join(',');
            const idsUrl = `https://www.reddit.com/by_id/${names}.json`;
            getByIds = getFromRedditApi(idsUrl);
        } else {
            getByIds = Promise.resolve({});
        }

        const hotUrl = 'https://www.reddit.com/hot.json';
        const getHot = getHotPosts(hotUrl);

        Promise.all([getHot, getByIds])
            .then(result => {
                const [hot, fav] = result;
                cb(null, {
                    hot,
                    fav
                })

            }).catch(e => {
                console.log('error in getting server data', e);
                cb(null, {
                    hot: {},
                    fav: {}
                });
            })

    });
}
function getHotPosts(url) {
    return readFromFile()
        .catch(e => {
            return getFromRedditApi(url)
                .then(json => saveToFile(json));
        })
}

function getFromRedditApi(url) {
    return new Promise((resolve, reject) => {

        https.get(url, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                var json = JSON.parse(body);
                resolve(json)
            });
        }).on('error', function (e) {
            console.log("Got an error: ", e);
            reject(e)
        });
    })
}

function saveToFile(data){
    const file = 'hot1.json';

    return Promise.resolve()
    .then(()=>{
        fs.writeFileSync(file, JSON.stringify(data));
        return Promise.resolve(data);
    })
}

function readFromFile() {
    const file = 'hot1.json';
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, f) => {
            if (err) {
                reject(err)
            }
            else {
                const { mtime } = f;
                const now = new Date();
                if (now.getTime() - mtime.getTime() < 200000) {
                     
                     try{
                        let contents = fs.readFileSync(file).toString();
                        contents = JSON.parse(contents)
                        resolve(contents);
                     }catch(e){
                        reject({});
                     }
                     
                } else {
                    reject({});
                }
            }
        })
    })
}










