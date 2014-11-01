/**
 * Example Feature
 * ===============
 *
 * this feature loads an HTML template and push it
 * into the title box of the page.
 */

var template = require('./template.html');
var el, target;

exports.run = function() {
    target = document.querySelector('.container');
    if (!target) {
        return false;
    }
    
    el = document.createElement('div');
    el.innerHTML = template;

    while (el.childNodes.length > 0) {
        target.appendChild(el.childNodes[0]);
    }
    
    return true;
};
