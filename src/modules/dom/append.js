var domify = require('domify');
var getElement = require('./get-element');

function append(target, content) {
    var targetNode = getElement(target);
    var contentNode = domify(content);
    targetNode.appendChild(contentNode);
}

module.exports = append;