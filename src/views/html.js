import React from 'react';


const Html = (props) => {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <title>MyReddit</title>
                <link rel="stylesheet" 
                      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" 
                      integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" 
                      crossOrigin="anonymous"
                />
                <link rel="stylesheet" 
                      href="styles.css" 
                />
            </head>
            <body>
                <div id="app">{props.children}</div>
                <script id="initial-data" type="text/plain" data-json={props.initialState}></script>
                <script src="/bundle.js"></script>
            </body>
        </html>
    );
};

export default Html;