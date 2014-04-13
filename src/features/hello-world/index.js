
var prepend = require('dom/prepend');

exports.start = function() {
    console.log('Feature "Hello World" has been started!');
    prepend('body', require('./templates/title.html'));
    prepend('body', require('./templates/hint.html'));
    console.log('Feature "Hello World" complete!');
    
    /*D console.log('comment2code!'); */
    
    /* D console.log('comment2code!'); */
    
};