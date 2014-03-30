/**
 * Must run before to minify HTML!
 *
 * ## TODO:
 * - 
 */

var WKS = require('../index');

var extend = require('extend');
var datauri = require('datauri');
var path = require('path');



module.exports = function(grunt) {
    
    grunt.registerTask('wkr-inline-assets', 'inline everything into html', function() {
        
        // disable the entire task from configuration
        var options = WKS.config.release.inline;
        if (options === false) {
            return;
        } else {
            options = options || {};
        }
        
        var inlineOptions = extend({
            css: true,
            js: true,
            exclude: []
        }, options);
        
        var html = grunt.file.read('build/release/index.html');
        
        // inline Javascript
        if (inlineOptions.js === true) {
            html = html.replace(/<script\s+src="([^"]*)"\s*><\/script>/g, function (match, href) {
                filePath = href.replace('./','build/release/');    
                var script = grunt.file.read(filePath);

                // fix for jQueryMobile known issues with inlined code!
                script = script.replace(/'"<\/script>'/g, '\'"<\'+\'/script>\'');
                script = script.replace(/<\/style>'/g, '</\'+\'style>\'');
                script = script.replace(/"<\/script>"/g, '"</"+"script>"'); 

                return '<script>' + script + '</script>';
            });
        }
        
        
        // inline CSS
        if (inlineOptions.css === true) {
            html = html.replace(/<link\s+rel="stylesheet"\s+href="([^"]*)"\s*\/>/g, function (match, href) {
                filePath = href.replace('./','build/release/');    
                
                if (filePath.indexOf('http://') !== -1 || filePath.indexOf('https://') !== -1) {
                    return match;
                } else {
                    var style = grunt.file.read(filePath);
                    style = style.replace(/url\((.*?)\)/ig, function(match, url) {
                        if (url.indexOf('data:image') === -1) {
                            return 'url("' + datauri(path.dirname(filePath) + '/' + url) + '")'
                        } else {
                            return match;
                        }
                    });
                    return '<style>' + style + '</style>';
                }
            });
        }
        
        grunt.file.write('build/release/index.html', html);
        
    });
    
};


