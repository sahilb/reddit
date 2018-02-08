import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import App from './src/app';
import Html from './src/html'

import fs from 'fs';

const indexFile = fs.readFileSync(__dirname + '/../public/index.html', 'utf8');

const fruits = ['apple', 'orange', 'mango', 'grapes'];

const app = express();

app.use(express.static('./public/'));

app.get('/fruits', (req, res) => {
    const html = renderToString( <App fruits={fruits}/>)
    var finalHtml = indexFile.replace('<!--Apps-->',html);
    finalHtml = finalHtml.replace('<!--initial-data--', JSON.stringify(fruits));
    
    res.set('Cache-Control', 'public, max-age=600,s-maxage=1000');
    res.send(finalHtml);
})

app.get('/test', (req, res) => {
    ReactDOMServer.renderToNodeStream(
        <Html fruits={JSON.stringify(fruits)}>
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
