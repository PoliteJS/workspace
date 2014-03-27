var WKS = require('../index');
var extend = require('extend');

module.exports = function(grunt) {

    grunt.registerTask('wks-configure', 'PoliteJS Workspace Configure', function() {
        
        var options = this.options();
        
        configClean(grunt);
        configCopy(grunt);
    
    });
    
    
    
    
};

function configClean(grunt) {   
    if (!grunt.config.data.clean) {
        grunt.config.data.clean = {};
    }
    grunt.config.data.clean = extend(true, {
        'wks-tmp': ['build/app'],
        'wkd-main': ['build/debug/**/*'],
        'wkr-before': ['build/release/**/*'],
        'wkr-after': ['build/release/assets/lib', 'build/release/assets/less']
    }, grunt.config.data.clean);
}


function configCopy(grunt) {
    if (!grunt.config.data.copy) {
        grunt.config.data.copy = {};
    }
    grunt.config.data.copy = extend(true, {
        'wkd-assets' : {
            files: [{
                expand: true, 
                cwd: 'src/assets',
                src: ['**'], 
                dest: 'build/debug/assets',
                filter: WKS.filters.excludeLess
            }]
        }
    }, grunt.config.data.copy);
}

