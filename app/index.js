/**
 * PoliteJS Workspace Boilerplate
 * ==============================
 * 
 * This is the main entry point of you application.
 * require here the modules your app needs to startup.
 *
 * NOTE: Non essential modules should be loaded asynchronously!
 * (http://webpack.github.io/docs/code-splitting.html)
 */

// resolve a feature dependency
var xApp = require('x-app');

// use the feature's API to do something very useful
xApp.run();

// DEBUG: exports the features I want to have access to from the browser's console.
// each Javascript entry point is available in the global scope as `window.fileName`.
// (you can control this option in the webpack.config.js)
//
// Try to:
// 1. run the app with `gulp start`
// 2. open the app with Google Chrome
// 3. open the web inspector > console
// write `index.xApp.run()`
exports.xApp = xApp;
