/**
 * PoliteJS Workspace
 * ===========================
 *
 * NOTICE: this is a v0.x.x project which means everithing can change in every moment.
 * Nothing is garanteed, nor features, neither configuration API. 
 * 
 * We are working hard to reach v1.0.0.
 * Please contribute with your own PR!
 *
 */

module.exports = function (grunt) {
    
    // Initialize PoliteJS Workspace
    var Workspace = require('./lib/workspace');
    Workspace.init(grunt);

    
    
    
    
    
// --------------------------------------- //
// ---[[   G R U N T   C O N F I G   ]]--- //
// --------------------------------------- //
    
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
        
        /**
         * Workspace Configuration
         */
        'workspace': {
            options: {
                minifyTemplates: false,
                release: {
                    uglify: {
                        beautify: true,
                        compress: false,
                        mangle: false
                    },
                    minifyHtml: false,
                    inline: {
                        css: false,
                        js: false
                    },
                    manifest: {
                        filename: 'appcache',
                        exclude: [
                            '/assets/readme.txt',    // exclude file path
                            '/assets/css/images/**'  // exclude an entire folder
                        ]
                    }
                },
//                karma: {
//                    test: {
//                        browsers: [
//                            'PhantomJS',
//                            'Chrome', 
//                            'ChromeCanary', 
//                            'Firefox', 
//                            'Opera'
//                        ]
//                    }
//                }
            }
        }
		
	});
    
    
    
    
    
// ------------------------------------------------------------------- //
// ---[[   W O R K S P A C E   P U B L I C   I N T E R F A C E   ]]--- //
// ------------------------------------------------------------------- //
    
    /**
     * All Workspace related tasks or targets are prefixed with:
     * - wks: general task
     * - wkd: build debut related stuff
     * - wkr: build release related stuff
     *
     * You can add your own tasks and targets in order to adapt the
     * building process to your needs.
     *
     */
    
    grunt.registerTask('build', [
        'workspace',
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
        'copy:wkr-modules',
        'copy:wkr-features',
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
        'cleanempty:wkr',
        'wkr-cache-manifest',
        'wkr-inline-assets',
        'wkr-minify-html'
    ]);
        
    grunt.registerTask('develop', [
        'build',
        'watch:wkd'
    ]);
    
    grunt.registerTask('test', [
        'build',
        'wks-karma',
        'karma:wks-test'
    ]);
    
    grunt.registerTask('start-ci', [
        'workspace',
        'wks-karma',
        'karma:wks-ci:start'
    ]);
    
    grunt.registerTask('ci', [
    	'build',
        'wks-karma',
        'karma:wks-ci:run',
		'watch:wks-ci'
    ]);
    
    grunt.registerTask('install', [
        'workspace',
    	'wks-npm-install-config',
		'wks-npm-install-run',
    ]);
    
    grunt.registerTask('default', ['install','release']);
    
    
    
    
    
// --------------------------------------------------- //
// ---[[   L O A D   G R U N T   M O D U L E S   ]]--- //
// --------------------------------------------------- //
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-cleanempty');
    
};
