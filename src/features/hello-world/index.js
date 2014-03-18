
var dom = require('./dom');

exports.init = function() {
    console.log('Feature "hello world" has been initialized!');
};

exports.start = function() {
    console.log('Feature "hello world" has been started!');
    dom.append('body', '<h1 class="jqbrick">jQbrick <small>Single Page App Builder</small></h1>');
    dom.append('body', '<p class="jqbrick-hint">[open your browser console]</p>');
};
