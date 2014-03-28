

var extend = require('extend');

module.exports = function(grunt) {
    
    grunt.registerTask('wks-karma-config', 'configure non-install task', function() {
        
        
        /**
         * Configure KARMA
         */
        if (!grunt.config.data.karma) {
            grunt.config.data.karma = {};
        }
        grunt.config.data.karma = extend(true, {
            'wks-test' : {
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
            'wks-ci' : {
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
        }, grunt.config.data.karma);
        
        
        
        
        /**
         * Configure WATCH task for karma-ci
         */
        if (!grunt.config.data.watch) {
            grunt.config.data.watch = {};
        }
        grunt.config.data.watch = extend(true, {
            'wks-ci' : {
                files: ['build/debug/**/*'],
                tasks: [
                	'wks-karma-config',
			        'wks-karma-build',
			        'karma:wks-ci:run',
                ],
                options: {
                    spawn: false
                }
            }
        }, grunt.config.data.watch);
        
    });
    
    
    /**
     * Karma Runner Utility
     * it extract all linked javascript in `index.html` and run through Karma
     */
    grunt.registerTask('wks-karma-build', 'build the full js stack to run under karma', function() {
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
