var WKS = require('../index');
var htmlMinify = require('html-minifier').minify;

module.exports = function(html) {
    
    // html minify template
    if (WKS.config.minifyTemplates !== false) {
        html = htmlMinify(html, WKS.config.minifyTemplates);
    }

    var tmp = 'module.exports = [';
    var rows = [];
    html.split('\n').forEach(function(row) {
        rows.push('unescape("' + escape(row) + '")');
    });
    
    return tmp + rows.join(',') + '].join(\'\\n\');';
};
