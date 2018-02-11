
import ReactDOM from 'react-dom';
import App from './views/app.js'
import SignInApp from './signin_app';
import React from 'react';

const initialData = JSON.parse(
    document
        .getElementById('initial-data')
        .getAttribute('data-json')
);

const {view} = initialData;
if (view === 'login' || view === 'register') {

    ReactDOM.hydrate(<SignInApp  {...initialData} />, document.querySelector('#app'))
} else {
    ReactDOM.hydrate(<App json={initialData.json} />, document.querySelector('#app'))
}
