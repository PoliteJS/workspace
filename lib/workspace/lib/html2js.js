var WKS = require('../index');
var htmlMinify = require('html-minifier').minify;

module.exports = function(html) {
    
    // html minify template
    try {
        html = htmlMinify(html, WKS.config.minifyTemplates);
    } catch(e) {
        console.log('!!! COULD NOT MINIFY A FEATURE TEMPLATE');
    }

    var tmp = 'module.exports = [';
    var rows = [];
    html.split('\n').forEach(function(row) {
        rows.push('unescape("' + escape(row) + '")');
    });
    
    return tmp + rows.join(',') + '].join(\'\\n\');';
};
