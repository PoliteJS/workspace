
var dom = require('./dom');

exports.init = function() {
    console.log('Feature "hello world" has been initialized!');
};

exports.start = function() {
    console.log('Feature "hello world" has been started!');
    dom.prepend('body', require('./templates/title'));
    dom.prepend('body', require('./templates/hint'));
};
