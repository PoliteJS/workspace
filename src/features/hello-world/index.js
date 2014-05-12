/**
 * HelloWorld Feature
 */

// load a global module
var prepend = require('dom/prepend');

// load some local resources.
// -- use relative urls --
var titleTpl = require('./templates/title.html');
var hintTpl = require('./templates/hint.html');



/**
 * Encapsulate and exports the startup logic so it can be
 * used from other features or it can be tested
 */
exports.start = function() {
    
    console.log('Feature "Hello World" has been started!');

    prepend('body', titleTpl);
    prepend('body', hintTpl);

    /*D console.log('comment2code!'); */
    /* D console.log('comment2code!'); */

    console.log('Feature "Hello World" completed!');
    
};


/**
 * This is just another "public API" of the hello world feature.
 * 
 * Try to open your console and run:
 * require('hello-world').sayIt()
 *
 * That's the concept of "feature as service".
 */
exports.sayIt = function() {
    alert('Hello World!');
};

/**
 * This should be moved to the entry point so the feature starts
 * when all the other features are fully loaded.
 *
 * Take a look at "jqb-lifecycle" module to learn more:
 * https://www.npmjs.org/package/jqb-lifecycle
 */
exports.start();
    