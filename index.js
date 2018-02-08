import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import App from './src/app';
import Html from './src/html'

import SignInApp from  './src/signin_app.js'

import fs from 'fs';




// const indexFile = fs.readFileSync(__dirname + '/../public/index.html', 'utf8');

const fruits = ['apple', 'orange', 'mango', 'grapes'];

const app = express();

app.use(express.static('./public/'));

app.get('/login', (req, res) => {
    const initialState = {
        view: 'login',
        title:'Sign in' ,
        otherTitle:'Create Account' ,
        otherUri: '/register',
        uri:'login'
    }
    ReactDOMServer.renderToNodeStream(
        <Html initialState={JSON.stringify(initialState)}>
            <SignInApp title='Sign in' otherTitle='Create Account' uri='login' otherUri='/register'/>
        </Html>
    ).pipe(res);
})

app.post('/login', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ success: true, serverMessage: 'none' }));
})
app.get('/register', (req, res) => {
    const initialState = {
        view: 'register',
        title:'Create Account' ,
        otherTitle:'Existing User' ,
        otherUri: '/login',
        uri:'register'
    }
    ReactDOMServer.renderToNodeStream(
        <Html initialState={JSON.stringify(initialState)}>
            <SignInApp title='Create Account' otherTitle='Existing User' uri='register' otherUri='/login'/>
        </Html>
    ).pipe(res);
})

app.post('/register', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ success: true, serverMessage: 'none' }));
})


app.get('/homepage', (req, res) => {
    const initialState = {
        view: 'homepage',
        fruits:fruits
    }
    ReactDOMServer.renderToNodeStream(
        <Html initialState={JSON.stringify(initialState)}>
            <App fruits={fruits}/>
        </Html>
    ).pipe(res);
})



app.listen(3000, ()=> console.log('listening on port 3000'));



// app.get('**', (req, res) => {
//     const html = renderToString( <App fruits={fruits}/>)
//     res.set('Cache-Control', 'public, max-age=600,s-maxage=1000');
//     res.send(html);
// })


// app.get('/fruits', (req, res) => {
//     const html = renderToString( <App fruits={fruits}/>)
//     var finalHtml = indexFile.replace('<!--Apps-->',html);
//     finalHtml = finalHtml.replace('<!--initial-data--', JSON.stringify(fruits));
    
//     res.set('Cache-Control', 'public, max-age=600,s-maxage=1000');
//     res.send(finalHtml);
// })