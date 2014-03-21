
var prepend = require('dom/prepend');

exports.start = function() {
    console.log('Feature "Hello World" has been started!');
    prepend('body', require('./templates/title'));
    prepend('body', require('./templates/hint'));
    console.log('Feature "Hello World" complete!');
};