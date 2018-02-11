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

import App from './../app';
import Html from './../html'
import SignInApp from './../signin_app'

import Homepage from './../views/HomePage'
import store from './../server/store'

const redditJson = require('./hot.json');

const app = express();

app.use(logger('dev'));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

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

    getRedditData((err, json) => {
        const initialState = {
            view: 'homepage',
            json
        }
        ReactDOMServer.renderToNodeStream(
            <Html initialState={JSON.stringify(initialState)}>
            </Html>
        ).pipe(res);
    })


})


app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login')
})

app.get('**', (req, res) => {
    res.redirect('/homepage');
})

app.listen(3000, () => console.log('listening on port 3000'));



function getRedditData(cb) {
    // setTimeout(()=> cb(null, redditJson), 100);
    // return;

    var url = 'https://www.reddit.com/hot.json';
    
    https.get(url, function (res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var json = JSON.parse(body);
            cb(null, json)
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
        cb(e, {})
    });
}











