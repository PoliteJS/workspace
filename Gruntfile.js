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
        
        
        copy: {
            
            
            'release-static' : {
                files: [{
                    expand: true, 
                    cwd: 'src/assets',
                    src: ['**'], 
                    dest: 'build/release/assets',
                    filter: function(path) {return path.indexOf('.less') === -1;}
                }]
            },
            'release-features-assets' : {
                files: [] // copiled dinamically
            },
            'release-features-assets-scripts' : {
                files: [], // copiled dinamically
                options: {
	                process: onCopyFeatureAssetsScriptsRelease
                }
            },
            'release-index-html' : {
                files: [{
                    expand: true, 
                    cwd: 'src',
                    src: ['**/*.html'], 
                    dest: 'build/release',
                    filter: function(filePath) {
                        if (filePath.indexOf('/features/') !== -1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }],
                options: {
                    process: onCopyIndexHtmlRelease
                }
            }
        },
        
        cleanempty: {
        	release: {
				src: ['build/release/**/*']
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
        
        cssmin: {
	        css: {
		        files: {}
	        }
        },
        
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
        
        'copy:release-static',
        
        'copy:wkd-modules',
        'copy:wkd-features',
        
        //'copy:build-features',
        //'copy:build-modules',
        'copy:build-less-sources',
        'copy:release-index-html',
        'release-prepare-feature-assets',
        'copy:release-features-assets',
        'copy:release-features-assets-scripts',
        'copy:build-index-js',
        'copy:build-index-less',
        'browserify:release-features',
        'less:release',
        'release-config-concat',
        'cssmin',
        'uglify',
        'release-clear-assets',
        'clean:wkr-after',
        //'clean:wks-tmp',
        'cleanempty:release'
        
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
	
    var path = require('path');
    var features = [];
    
    
    function onCopyIndexHtmlRelease(html) {    	
        html = html.replace('<!--[/CSS]-->', '<link rel="stylesheet" href="./assets/css/features.css" /><!--[/CSS]-->');
        html = html.replace('<!--[/JS]-->', '<script src="./assets/js/features.js"></script><!--[/JS]-->');
        return html;
    }
    
    
    
    
   
    
    
    
    
    
    
    
    
    
    
    /**
     * Copy features assets folders:
     * use `url(feature://file.jpg)` to refer to feature's assets 
     * use `url(assets://img/file.jpg)` to refer to the workspace's assets
     */
    
    grunt.registerTask('release-prepare-feature-assets', 'copy features assets folder', function() {
    	wks.features.forEach(function(item) {
	    	grunt.config.data.copy['release-features-assets'].files.push({
				expand: true,
				src: ['**'],
				cwd: 'src/features/' + item + '/assets',
				dest: 'build/release/assets/' + item
			});
			grunt.config.data.copy['release-features-assets-scripts'].files.push({
				expand: true,
				src: ['**'],
				cwd: 'src/features/' + item + '/assets',
				dest: 'build/release/assets/' + item,
				filter: filterFeatureAssetsScripts
			});
    	});
    });

    
    function onCopyFeatureAssetsScriptsRelease(content, path) {
    	var feature = path.split('/features/')[1].split('/')[0];
    	content = content.replace(/feature:\/\//g, '../' + feature + '/');
    	content = content.replace(/assets:\/\//g, '../');
	    return content;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
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
    
    
    var cssList = [];
    var libList = [];
    var jsList = [];
    
    grunt.registerTask('release-config-concat','', function() {
	    var html = grunt.file.read('build/release/index.html');
	    
        html.replace(/<!--\[CSS\]-->((?:.|[\r\n])*)<!--\[\/CSS\]-->/g, function(match, content) {
        	content.replace(/<link\s+rel="stylesheet"\s+href="([^"]*)"\s*\/>/g, function (match, href) {
				cssList.push(href.replace('./','build/release/'));
	        });
	        grunt.config.data.cssmin.css.files['build/release/assets/css/app.min.css'] = cssList;
        });
        
        html.replace(/<!--\[JS\]-->((?:.|[\r\n])*)<!--\[\/JS\]-->/g, function(match, content) {
        	content.replace(/<script\s+src="([^"]*)"\s*><\/script>/g, function (match, href) {
				jsList.push(href.replace('./','build/release/'));
	        });
	        grunt.config.data.uglify.js.files['build/release/assets/js/app.min.js'] = jsList;
        });
        
        html.replace(/<!--\[LIB\]-->((?:.|[\r\n])*)<!--\[\/LIB\]-->/g, function(match, content) {
        	content.replace(/<script\s+src="([^"]*)"\s*><\/script>/g, function (match, href) {
				libList.push(href.replace('./','build/release/'));
	        });
	        grunt.config.data.uglify.lib.files['build/release/assets/js/lib.min.js'] = libList;
        });
	    
	    // replace incusion blocks
    	html = html.replace(/<!--\[CSS\]-->[\s\S]*?<!--\[\/CSS\]-->/g, '<link rel="stylesheet" href="./assets/css/app.min.css" />');
    	html = html.replace(/<!--\[JS\]-->[\s\S]*?<!--\[\/JS\]-->/g, '<script src="./assets/js/app.min.js"></script>');
    	html = html.replace(/<!--\[LIB\]-->[\s\S]*?<!--\[\/LIB\]-->/g, '<script src="./assets/js/lib.min.js"></script>');
    	grunt.file.write('build/release/index.html', html);
    });
    
    grunt.registerTask('release-clear-assets','', function() {
	    cssList.forEach(grunt.file.delete);
	    libList.forEach(grunt.file.delete);
	    jsList.forEach(grunt.file.delete);
	    grunt.file.delete('build/release/assets/css/features.debug.css');
	    grunt.file.delete('build/release/assets/js/features.debug.js');
    });
    
};
