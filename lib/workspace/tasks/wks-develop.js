

var extend = require('extend');

module.exports = function(grunt) {
    
    grunt.registerTask('wks-develop', 'setup watch config for develop', function() {
        if (!grunt.config.data.watch) {
            grunt.config.data.watch = {};
        }
        grunt.config.data.watch = extend(true, {
            wkd : {
                files: ['Gruntfile.js', 'src/**/*'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            }
        }, grunt.config.data.watch);
    });
    
};
