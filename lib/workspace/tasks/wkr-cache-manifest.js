
var WKS = require('../index');

var extend = require('extend');
var manifest = require('../lib/manifest');



module.exports = function(grunt) {
    
    
    
    
    grunt.registerTask('wkr-cache-manifest', 'create offline manifest for release app', function() {
        
        // disable the entire task from configuration
        var options = WKS.config.release.manifest;
        if (options === false) {
            return;
        } else {
            options = options || {};
        }
        
        var manifestOptions = extend({
            version: grunt.config.data.pkg.version,
            filename: 'cache',
            exclude: [],
            generateHtaccess: true,
            updateHtmlTag: true,
//            network : ['/connect.php','/read.php'],
//            fallback : ['/offline.html']
        }, options, {
            path: process.cwd() + '/build/release'
        });
        
        // basic exclude rules
        manifestOptions.exclude.push('/.DS_Store');
        manifestOptions.exclude.push('/.htaccess');
        manifestOptions.exclude.push('/' + manifestOptions.fileName + '.manifest');
        
        // generate manifest file
        manifest(manifestOptions);
        
        // update HTML to embed manifest file
        if (manifestOptions.updateHtmlTag === true) {
            var html = grunt.file.read('build/release/index.html');
            var attr = ' manifest="' + manifestOptions.filename + '.manifest"';
            if (html.indexOf(attr) === -1) {
                html = html.replace('<html', '<html' + attr);
            }
            grunt.file.write('build/release/index.html', html);
        }
        
    });
    
    
};
