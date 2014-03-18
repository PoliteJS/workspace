
var dom = require('./dom');

exports.init = function() {
    console.log('Feature "hello world" has been initialized!');
};

exports.start = function() {
    console.log('Feature "hello world" has been started!');
    dom.append('body', require('./templates/title'));
    dom.append('body', require('./templates/hint'));
};
