
const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(createProxyMiddleware('/api', // replace with your endpoint
        { target: '0.0.0.0:5000',
        secure: false } // replace with your target
    ));
}

// const { createProxyMiddleware } = require('http-proxy-middleware');
// // const proxy = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(proxy('/api', { target: 'http://localhost:5000/', secure: false }));
// };