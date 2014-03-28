
var WKS = require('../index');
var htmlMinify = require('html-minifier').minify;

module.exports = function(grunt) {
    
    var cssList = [];
    var libList = [];
    var jsList = [];
    
    grunt.registerTask('wkr-config-concat','', function() {
	    var html = grunt.file.read('build/release/index.html');
	    
        html.replace(/<!--\[CSS\]-->((?:.|[\r\n])*)<!--\[\/CSS\]-->/g, function(match, content) {
        	content.replace(/<link\s+rel="stylesheet"\s+href="([^"]*)"\s*\/>/g, function (match, href) {
				cssList.push(href.replace('./','build/release/'));
	        });
	        grunt.config.data.cssmin.wkr.files['build/release/assets/css/app.min.css'] = cssList;
        });
        
        html.replace(/<!--\[JS\]-->((?:.|[\r\n])*)<!--\[\/JS\]-->/g, function(match, content) {
        	content.replace(/<script\s+src="([^"]*)"\s*><\/script>/g, function (match, href) {
				jsList.push(href.replace('./','build/release/'));
	        });
	        grunt.config.data.uglify['wkr-js'].files['build/release/assets/js/app.min.js'] = jsList;
        });
        
        html.replace(/<!--\[LIB\]-->((?:.|[\r\n])*)<!--\[\/LIB\]-->/g, function(match, content) {
        	content.replace(/<script\s+src="([^"]*)"\s*><\/script>/g, function (match, href) {
				libList.push(href.replace('./','build/release/'));
	        });
	        grunt.config.data.uglify['wkr-lib'].files['build/release/assets/js/lib.min.js'] = libList;
        });
	    
	    // replace incusion blocks
    	html = html.replace(/<!--\[CSS\]-->[\s\S]*?<!--\[\/CSS\]-->/g, '<link rel="stylesheet" href="./assets/css/app.min.css" />');
    	html = html.replace(/<!--\[JS\]-->[\s\S]*?<!--\[\/JS\]-->/g, '<script src="./assets/js/app.min.js"></script>');
    	html = html.replace(/<!--\[LIB\]-->[\s\S]*?<!--\[\/LIB\]-->/g, '<script src="./assets/js/lib.min.js"></script>');
        
        
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
    
    
    grunt.registerTask('wkr-clear-assets','', function() {
	    cssList.forEach(deleteFile);
	    libList.forEach(deleteFile);
	    jsList.forEach(deleteFile);
        deleteFile('build/release/assets/css/features.debug.css');
        deleteFile('build/release/assets/js/features.debug.js');
    });
    
    function deleteFile(filePath) {
        if (grunt.file.exists(filePath)) {
            grunt.file.delete(filePath);
        }
    }
    
};
