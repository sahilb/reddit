
import ReactDOM from 'react-dom';
import App from './app.js'
import React from 'react';
// import {render} from 'react-dom'

const fruits = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));

ReactDOM.hydrate( <App fruits={fruits}/>, document.querySelector('#app'))