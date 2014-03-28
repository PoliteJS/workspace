/**
 * 
 */

module.exports = function(source) {
    source = source.replace(/(?:\/\*D((?:[\s\S]*?))\*\/)/gm, prefixMatchContent);
    source = source.replace(/(?:\/\*\sD((?:[\s\S]*?))\*\/)/gm, prefixMatchContent);
    return source;
};

function prefixMatchContent(block, content) {
    return '/**DEBUG**/ ' + content;
}