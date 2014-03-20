var domify = require('../domify');
var getElement = require('./get-element');

function prepend(target, content) {
    var targetNode = getElement(target);
    var contentNode = domify(content);
    targetNode.insertBefore(contentNode, targetNode.firstChild);
}

module.exports = prepend;