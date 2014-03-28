

var extend = require('extend');

module.exports = function(grunt) {
    
    /**
     * Karma Runner Utility
     * it extract all linked javascript in `index.html` and run through Karma
     */
    grunt.registerTask('wks-karma', 'build the full js stack to run under karma', function() {
        var source = grunt.file.read('build/debug/index.html');
        
        // extract scripts form index.html
        var paths = [];
		source.replace(/<script\s+src="([^"]*)"\s*><\/script>/g, function (match, href) {
            if (href.indexOf('./') !== -1) {
                paths.push(href.replace('./', 'build/debug/'));
            }
		});
        
        // add code coverage preprocesso in test
        paths.forEach(function(path) {
            grunt.config.data.karma['wks-test'].options.preprocessors[path] = ['coverage'];
        });
        
        paths.push('src/features/**/specs/**/*.spec.js');
        paths.push('src/modules/**/specs/**/*.spec.js');
        grunt.config.data.karma['wks-test'].options.files = paths;
        grunt.config.data.karma['wks-ci'].options.files = paths;
    });
    
};
