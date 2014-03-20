
var prepend = require('dom/prepend');

exports.init = function() {
    console.log('Feature "hello world" has been initialized!');
};

exports.start = function() {
    console.log('Feature "hello world" has been started!');
    prepend('body', require('./templates/title'));
    prepend('body', require('./templates/hint'));
};
