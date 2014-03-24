/**
 * PoliteJS Workspace
 */

module.exports = function (grunt) {

	var pkg = grunt.file.readJSON('package.json');
	
// ----------------------------------------------------- //
// ---[[   G R U N T   C O N F I G U R A T I O N   ]]--- //
// ----------------------------------------------------- //

	grunt.initConfig({

		pkg: pkg,
        
        clean: {
            build: ['build/debug/**/*'],
            'build-tmp': ['build/app'],
            release: ['build/release/**/*']
        },
        
        copy: {
            'build-static' : {
                files: [{
                    expand: true, 
                    cwd: 'src/assets',
                    src: ['**'], 
                    dest: 'build/debug/assets'
                }]
            },
            'build-modules' : {
                files: [{
                    expand: true, 
                    cwd: 'src/modules',
                    src: ['**'], 
                    dest: 'build/app/modules'
                }],
                options: {
                    process: onCopyModuleFile
                }
            },
            'build-features' : {
                files: [{
                    expand: true, 
                    cwd: 'src/features',
                    src: ['**/*'], 
                    dest: 'build/app/features',
                    rename: onCopyFeatureRename
                }],
                options: {
                    process: onCopyFeatureFile
                }
            },
            'build-less-sources' : {
                files: [{
                    expand: true, 
                    cwd: 'src',
                    src: ['**/*.less'],
                    dest: 'build/app'
                }],
                options: {
                    process: onCopyLessFile
                }
            },
            'build-index-html' : {
                files: [{
                    expand: true, 
                    cwd: 'src',
                    src: ['**/*.html'], 
                    dest: 'build/debug',
                    filter: function(filePath) {
                        if (filePath.indexOf('/features/') !== -1) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }],
                options: {
                    process: onCopyIndexHtml
                }
            },
            'build-index-js' : {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['index.js'], 
                    dest: 'build/app'
                }],
                options: {
                    process: onCopyIndexJs
                }
            },
            'build-index-less' : {
                files: [{
                    expand: true, 
                    cwd: 'src',
                    src: ['index.less'], 
                    dest: 'build/app'
                }],
                options: {
                    process: onCopyIndexLess
                }
            },
            'build-sourcemap-js' : {
                files: [{
                    expand: true, 
                    cwd: 'build/app',
                    src: ['features.debug.js'], 
                    dest: 'build/debug/assets/js'
                }],
                options: {
                    process: onCopyJsSourcemap
                }
            },
            'build-sourcemap-less' : {
                files: [{
                    expand: true, 
                    cwd: 'build/app',
                    src: ['features.debug.css.map'], 
                    dest: 'build/debug'
                }],
                options: {
                    process: onCopyCssSourcemap
                }
            },
            'build-less-css' : {
                files: [{
                    expand: true, 
                    cwd: 'build/app',
                    src: ['features.debug.css'], 
                    dest: 'build/debug/assets/css'
                }],
                options: {
                    process: onCopyLessCss
                }
            }
        },
		
		browserify: {
            'build-features': {
                files: {
                    'build/app/features.debug.js' : ['build/app/index.js']
                },
                options: {
                    bundleOptions : {
                        debug: true
                    },
                    alias: []
                }
            }
        },
        
        less: {
			build: {
				files: {
					'build/app/features.debug.css' : ['build/app/index.less']
				},
                options: {
                    sourceMap: true,
                    sourceMapFilename: 'build/app/features.debug.css.map'
                },
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
        }
		
	});


// ---------------------------------------------------//
// ---[[   L O A D   L I B R A R Y   T A S K S   ]]--- //
// ---------------------------------------------------//
	
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');



// --------------------------------------------- //
// ---[[   A V A I L A B L E   T A S K S   ]]--- //
// --------------------------------------------- //

	grunt.registerTask('build', [
        'clean:build',
        'copy:build-static',
        'copy:build-features',
        'copy:build-modules',
        'copy:build-less-sources',
        'copy:build-index-html',
        'copy:build-index-js',
        'copy:build-index-less',
        'feature-assets',
        'browserify:build-features',
        'less:build',
        'copy:build-sourcemap-js',
        'copy:build-sourcemap-less',
        'copy:build-less-css',
        'clean:build-tmp'
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
	
    grunt.registerTask('default', ['build']);
    
	
// ----------------------------- //
// ---[[   H E L P E R S   ]]--- //	
// ----------------------------- //
	
    var path = require('path');
    var features = [];
    
    function onCopyModuleFile(content, filePath) {   
        filePath2BrowserifyAlias(filePath, 'modules');
        return content;
    }
    
    function onCopyFeatureFile(content, filePath) {   
        var feature = path.dirname(filePath).replace('src/features/','').split('/').shift();
        if (features.indexOf(feature) === -1) {
            features.push(feature);
        }
        
        // create browserify alias 
        filePath2BrowserifyAlias(filePath, 'features');
        
        // transform template.html files into CommonJS modules
        if (filePath.indexOf('.html') !== -1) {
            var tmp = 'module.exports = [';
            var rows = [];
            content.split('\n').forEach(function(row) {
                rows.push('unescape("' + escape(row) + '")');
            });
            content = tmp + rows.join(',') + '].join(\'\\n\');';
        }
        
        return content;
    }
    
    // rename templates files into js
    function onCopyFeatureRename(dest, src) {
        if (src.indexOf('.html') !== -1) {
            return dest + '/' + src.replace('.html', '.js');
        } else {
            return dest + '/' + src;
        }
    }
    
    function onCopyIndexHtml(html) {
        html = html.replace('<!--[/CSS]-->', '<link rel="stylesheet" href="./assets/css/features.debug.css" /><!--[/CSS]-->');
        html = html.replace('<!--[/JS]-->', '<script src="./assets/js/features.debug.js"></script><!--[/JS]-->');
        return html;
    }
    
    function onCopyIndexJs(source) {
        if (features.length) {
            source = source.replace('/*FEATURES*/', "require('" + features.join("'),require('") + "')");
        }
        return source;
    }
    
    function onCopyIndexLess(source) {
        var lessBasePath = 'build/app/features/**/index.less';
        var replaceWith = '';
        features.forEach(function(feature) {
            var lessFeaturePath = lessBasePath.replace('**', feature);
            if (grunt.file.exists(lessFeaturePath)) {
                replaceWith += '@import "features/' + feature + '/index.less";';
            }
        });
        source = source.replace('/*FEATURES*/', replaceWith);
        source = source.replace(/assets:\/\//g, '../'); // support assets link
        return source;
    }
    
    function onCopyJsSourcemap(source) {
        var b64Start = source.indexOf('//# sourceMappingURL=') + '//# sourceMappingURL=data:application/json;base64,'.length;
        var b64Src = source.substr(b64Start, source.length);
        var plain = new Buffer(b64Src, 'base64').toString('ascii');
        
        var re = new RegExp(__dirname, 'g');
        plain = plain.replace(re, '');
        plain = plain.replace(/\"\/build\/app\//g, '"/src/');
        
        source = source.replace(b64Src, new Buffer(plain).toString('base64'));
        return source;
    }
    
    function onCopyCssSourcemap(source) {
        source = source.replace(/\"build\/app/g, '"/src');
        return source;
    }
    
    function onCopyLessCss(source) {
        source = source.replace('sourceMappingURL=build/app/', 'sourceMappingURL=../../');
        return source;
    }
    
    /**
     * Exports features/ and modules/ to browserify aliases so to be required
     * by name like: 
     *      require('module-name')
     * 
     * You can expose more than the module name by editing a module/package.json
     *      {
     *           "exports" : ['submodule-name', 'submodule-name/sub-submodule-name'],
     *           "globals" : ['submodule-name'],
     *      }
     *
     * "exports" key let a submodule to be vailable as
     *      require('module-name/submodule-name')`
     * 
     * "globals" key let a submodule to pollute the global module namespace:
     * (this allow a module to act more like a package of modules)
     *      require('submodule-name')`
     *
     */
    function filePath2BrowserifyAlias(filePath, type) {
        
        var mode = '';
        var moduleName = path.dirname(filePath).replace('src/' + type + '/','').split('/').shift();
        
        // try to read module's package.json to search submodules to export
        var pkgPath = 'src/' + type + '/' + moduleName + '/package.json';
        if (grunt.file.exists(pkgPath)) {
            var pkgObj = grunt.file.readJSON(pkgPath);
            if (pkgObj.exports === true) {
                mode = 'FULL';
            } else if ((typeof pkgObj.exports === 'object' && typeof pkgObj.exports.push === 'function') || (typeof pkgObj.globals === 'object' && typeof pkgObj.globals.push === 'function')) {
                mode = [moduleName];
                if (pkgObj.exports) {
                    pkgObj.exports.forEach(function(subModule) {
                        mode.push(moduleName + '/' + subModule);
                    });
                }
                if (pkgObj.globals) {
                    pkgObj.globals.forEach(function(subModule) {
                        mode.push(moduleName + '/' + subModule);
                    });
                }
            }
        }
        
        // exports all single sub items of a module
        if (mode) {
            
            // support HTML templates
            if (filePath.indexOf('.html') !== -1) {
                filePath = filePath.replace('.html', '.js');
            }
            
            var modulePath = filePath.replace('src/' + type + '/','');
            if (modulePath.indexOf('.js') !== -1 ) {
                var scriptName = modulePath.substr(modulePath.lastIndexOf('/')+1, modulePath.lastIndexOf('.')-modulePath.lastIndexOf('/')-1);
                if (scriptName === 'index') {
                    scriptName = modulePath.substr(0, modulePath.lastIndexOf('/'));
                } else {
                    scriptName = modulePath.substr(0, modulePath.lastIndexOf('.'));
                }
                // export alias, try also to export globals sub modules of a package
                if (mode === 'FULL' || mode.indexOf(scriptName) !== -1) {
                    var subName = scriptName.substring(moduleName.length+1, scriptName.length);
                    if (pkgObj && pkgObj.globals && pkgObj.globals.indexOf(subName) !== -1) {
                        browserifyAddAlias('build/app/' + type + '/' + modulePath+':'+subName);
                    } else {
                        browserifyAddAlias('build/app/' + type + '/' + modulePath+':'+scriptName);
                    }
                    
                }
            }
            
        // exports only the module name, all internal pieces are masked
        } else {
            browserifyAddAlias('build/app/' + type + '/' + moduleName + '/index.js:' + moduleName);
        }
    }
    
    function browserifyAddAlias(alias) {
        if (grunt.config.data.browserify['build-features'].options.alias.indexOf(alias) === -1) {
            grunt.config.data.browserify['build-features'].options.alias.push(alias);
        }
    }
    
    
    /**
     * Copy features assets folders:
     * use `url(feature://file.jpg)` to refer to feature's assets 
     * use `url(assets://img/file.jpg)` to refer to the workspace's assets
     */
    grunt.registerTask('feature-assets', 'copy features assets folder', function() {
        require('async').each(features, function(item, callback) {
            var source = process.cwd() + '/src/features/' + item + '/assets';
            var dest = process.cwd() + '/build/debug/assets/' + item;
            if (grunt.file.exists(source)) {
                require('ncp').ncp(source, dest, callback);
            } else {
                callback();
            }
        }, this.async());
    });
    
    function onCopyLessFile(content, path) {
        var found = false;
        features.forEach(function(feature) {
            if (path.indexOf('/' + feature + '/') !== -1) {
                content = content.replace(/feature:\/\//g, '../' + feature + '/');
                content = content.replace(/assets:\/\//g, '../');
                found = true;
            }
        });
        if (found === false) {
            content = content.replace(/assets:\/\//g, '../');
        }
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
    
};
