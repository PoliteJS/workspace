
var extend = require('extend');
var WKS = require('../index');


// internal helpers
var copyFilters = require('../lib/copy-filters');
var copyCallbacks = require('../lib/copy-callbacks');

// run config scripts
var configs = [
    'clean',
    'copy-build',
    'browserify',
    'less',
    'cssmin',
    'uglify',
    'cleanempty',
    'karma',
    'watch'
];


module.exports = function(grunt) {
    
    grunt.registerTask('workspace', 'PoliteJS Workspace Configure', function() {
        
        // build global available configuration
        WKS.config = extend(true, WKS.config, this.options());
        
        // run configs scripts
        configs.forEach(function(fn) {
            var fn = require('../configs/' + fn);
            fn(grunt);
        });
    
    });
    
};


