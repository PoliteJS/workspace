/**
 * PoliteJS Workspace
 */



module.exports = function (grunt) {
    
    var wks = require('./grunt-workspace');
    wks.init(grunt);
    
	var pkg = grunt.file.readJSON('package.json');
	
// ----------------------------------------------------- //
// ---[[   G R U N T   C O N F I G U R A T I O N   ]]--- //
// ----------------------------------------------------- //

	grunt.initConfig({

		pkg: pkg,
        
        'wks-configure': {
            options: {
                foo: 'Foo',
                faa: 'Faa'
            }
        },
        
        
        watch: {
            build: {
                files: ['Gruntfile.js', 'src/**/*'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            }
        },
        
		
	});


// ---------------------------------------------------//
// ---[[   L O A D   L I B R A R Y   T A S K S   ]]--- //
// ---------------------------------------------------//
	
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-cleanempty');
    
    



// --------------------------------------------- //
// ---[[   A V A I L A B L E   T A S K S   ]]--- //
// --------------------------------------------- //

	grunt.registerTask('build', [
        'wks-configure',
        'clean:wkd-main',
        'copy:wkd-assets',
        'copy:wkd-modules',
        'copy:wkd-features',
  		'copy:wkd-less-sources',
  		'copy:wkd-index-html',
        'copy:wkd-index-js',
        'copy:wkd-index-less',
        'wkd-feature-assets',
        'copy:wkd-feature-assets',
        'copy:wkd-feature-assets-scripts',
        'browserify:wkd',
        'less:wkd',
        'copy:wkd-sourcemap-js',
        'copy:wkd-sourcemap-less',
        'copy:wkd-less-css',
        'clean:wks-tmp'
    ]);
    
    grunt.registerTask('release', [
    	'build',
        'clean:wkr-before',
        'copy:wkr-assets',
        'copy:wkd-modules',
        'copy:wkd-features',
        'copy:wkd-less-sources',
        'copy:wkr-index-html',
        'wkr-feature-assets',
        'copy:wkr-feature-assets',
        'copy:wkr-feature-assets-scripts',
        'copy:wkd-index-js',
        'copy:wkd-index-less',
        'browserify:wkr',
        'less:wkr',
        'wkr-config-concat',
        'cssmin:wkr',
        'uglify:wkr-lib',
        'uglify:wkr-js',
        'wkr-clear-assets',
        'clean:wkr-after',
        'clean:wks-tmp',
        'cleanempty:wkr'
    ]);
        
    grunt.registerTask('develop', [
        'build',
        'watch:build'
    ]);
    
    grunt.registerTask('test', [
        'build',
        'wks-karma-config',
        'wks-karma-build',
        'karma:wks-test'
    ]);
    
    grunt.registerTask('start-ci', [
        'build',
        'wks-karma-config',
        'wks-karma-build',
        'karma:wks-ci:start'
    ]);
    
    grunt.registerTask('ci', [
    	'build',
        'wks-karma-config',
        'wks-karma-build',
        'karma:wks-ci:run',
		'watch:wks-ci'
    ]);
    
    grunt.registerTask('install', [
    	'wks-npm-install-config',
		'wks-npm-install-run',
    ]);
    
    grunt.registerTask('default', ['install','release']);
        
    
    
};
