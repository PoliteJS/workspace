
var WKS = require('../index');
var htmlMinify = require('html-minifier').minify;

module.exports = function(grunt) {
    
    grunt.registerTask('wkr-minify-html','', function() {
	    var html = grunt.file.read('build/release/index.html');
        
        // minify page source
        if (WKS.config.release.minifyHtml !== false) {
            try {
                html = htmlMinify(html, WKS.config.release.minifyHtml);
            } catch(e) {
                console.log('!!! COULD NOT MINIFY: index.html');
            }
        }
        
    	grunt.file.write('build/release/index.html', html);
    });
    
};
