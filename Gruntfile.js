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
        
        
        
        
        karma: {
            test: {
                configFile: 'karma.conf.js',
                options: {
                    singleRun: true,
                    browsers: [
                        'PhantomJS'
//                        'Chrome', 
//                        'ChromeCanary', 
//                        'Firefox', 
//                        'Opera'
                    ],
                    reporters: [
                        'progress',
                        'coverage',
                        'osx'
                    ],
                    preprocessors: {}, // filled dinamically
                    coverageReporter: {
                        type: 'html',
                        dir: 'build/coverage/'
                    }
                }
            },
            ci: {
                configFile: 'karma.conf.js',
                options: {
                    singleRun: false,
                    browsers: ['PhantomJS'],
                    reporters: [
                        'progress',
                        'osx'
                    ]
                }
            }
        },
        
        watch: {
            build: {
                files: ['Gruntfile.js', 'src/**/*'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            },
            ci: {
                files: ['build/debug/**/*'],
                tasks: ['debug-karma-scripts', 'karma:ci:run'],
                options: {
                    spawn: false
                }
            }
        },
        
        'npm-install' : {
            src: {
                files: [{
                    expand: true, 
                    cwd: 'src/features',
                    src: ['*/package.json'],
                },{
                    expand: true, 
                    cwd: 'src/modules',
                    src: ['*/package.json'],
                }]
            }
        },
        
        /*
cssmin: {
	        css: {
		        files: {}
	        }
        },
*/
        
        /*
uglify: {
        	options: {
        		mangle: false,
	        	compress: false,
                beautify: true
        	},
			lib: {
				files: {}
			},
			js: {
				files: {}
			}
		}
*/
		
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
        'debug-karma-scripts',
        'karma:test'
    ]);
    
    grunt.registerTask('start-ci', [
        'build',
        'debug-karma-scripts',
        'karma:ci:start'
    ]);
    
    grunt.registerTask('ci', [
        'build',
        'debug-karma-scripts',
        'karma:ci:run',
        'watch:ci'
    ]);
    
    grunt.registerTask('install', ['npm-install']);
    grunt.registerTask('default', ['install','release']);
    
	
// ----------------------------- //
// ---[[   H E L P E R S   ]]--- //	
// ----------------------------- //
	
    
    /**
     * Karma Runner Utility
     * it extract all linked javascript in `index.html` and run through Karma
     */
    grunt.registerTask('debug-karma-scripts', 'build the full js stack to run under karma', function() {
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
            grunt.config.data.karma.test.options.preprocessors[path] = ['coverage'];
        });
        
        paths.push('src/features/**/specs/**/*.spec.js');
        paths.push('src/modules/**/specs/**/*.spec.js');
        grunt.config.data.karma.test.options.files = paths;
        grunt.config.data.karma.ci.options.files = paths;
    });
    
    
    /**
     * Install a sub-folder npm dependencies
     */
    var path = require('path');
    var shell = require('shelljs');
    grunt.registerMultiTask('npm-install', 'install NPM dependencies of /features and /modules', function() {
        this.filesSrc.forEach(function(filePath) {
            var pkg = grunt.file.readJSON(filePath);
            if (pkg.dependencies) {
                grunt.log.writeln('NPM INSTALL: ', path.dirname(filePath));
                var folderPath = process.cwd() + '/' + path.dirname(filePath);
                shell.exec('cd ' + folderPath + ' && npm install');
            }
        });
    });
    
};
