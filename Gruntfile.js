/**
 * TestBrowserify
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
                }]
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
                    debug: true,
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
        
        watch: {
            build: {
                files: ['Gruntfile.js', 'src/**/*'],
                tasks: ['build']
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
	
    grunt.registerTask('default', ['build']);
    
	
// ----------------------------- //
// ---[[   H E L P E R S   ]]--- //	
// ----------------------------- //
	
    var path = require('path');
    var features = [];
    
    
    
    
    function onCopyModuleFile(content, filePath) {   
        filePath2BrowserifyAlias(filePath, 'modules', 'FULL');
        return content;
    }
    
    function onCopyFeatureFile(content, filePath) {   
        var feature = path.dirname(filePath).replace('src/features/','').split('/').shift();
        if (features.indexOf(feature) === -1) {
            features.push(feature);
        }
        
        // create browserify alias 
        filePath2BrowserifyAlias(filePath, 'features','FULL');
        
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
     * by name like: `require('module-name')`
     *
     * mode=FULL:
     * exports the module name and each included file as selfish module path:
     * - require('module')
     * - require('module/submodule')
     *
     * Whithout "full mode" active only the module's name is aliased.
     * This is meant to be for production usage.
     */
    /**
     * @TODO: should search for a "package.json::exports" key which contain a list of
     * sub modules to export (or exports:true to export all)
     * then will be up each module to set the exports level
     */
    function filePath2BrowserifyAlias(filePath, type, mode) {
        
        var moduleName = path.dirname(filePath).replace('src/' + type + '/','').split('/').shift();
        
        // exports all single sub items of a module
        if (mode === 'FULL') {
            
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
                browserifyAddAlias('build/app/' + type + '/' + modulePath+':'+scriptName);
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
    
};
