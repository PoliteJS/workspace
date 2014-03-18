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
            'build-tmp': [
                'build/debug/modules',
                'build/debug/features',
                'build/debug/index.js',
                'build/debug/index.less'
            ],
            release: ['build/release/**/*']
        },
        
        copy: {
            'build-static' : {
                files: [
                    {expand: true, cwd: 'src/assets',src: ['**'], dest: 'build/debug/assets'}
                ]
            },
            'build-modules' : {
                files: [
                    {expand: true, cwd: 'src/modules',src: ['**'], dest: 'build/debug/modules'}
                ],
                options: {
                    process: onCopyModuleFile
                }
            },
            'build-features' : {
                files: [{
                    expand: true, 
                    cwd: 'src/features',
                    src: ['**/*'], 
                    dest: 'build/debug/features',
                    rename: onCopyFeatureRename
                }],
                options: {
                    process: onCopyFeatureFile
                }
            },
            'build-less-sources' : {
                files: [
                    {expand: true, cwd: 'src',src: ['**/*.less'], dest: 'build/debug'}
                ]
            },
            'build-index-html' : {
                files: [
                    {expand: true, cwd: 'src',src: ['**/*.html'], dest: 'build/debug'}
                ],
                options: {
                    process: onCopyIndexHtml
                }
            },
            'build-index-js' : {
                files: [
                    {expand: true, cwd: 'src',src: ['index.js'], dest: 'build/debug'}
                ],
                options: {
                    process: onCopyIndexJs
                }
            },
            'build-index-less' : {
                files: [
                    {expand: true, cwd: 'src',src: ['index.less'], dest: 'build/debug/'}
                ],
                options: {
                    process: onCopyIndexLess
                }
            }
        },
		
		browserify: {
            'build-features': {
                files: {
                    'build/debug/assets/js/features.debug.js' : ['build/debug/index.js']
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
					'build/debug/assets/css/features.debug.css' : ['build/debug/index.less']
				},
                options: {
                    sourceMap: true,
                    sourceMapFilename: 'build/debug/assets/css/features.debug.css.map',
                    sourceMapBasepath: 'build/debug/assets/css/'
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
        var name = path.dirname(filePath).replace('src/modules/','').split('/').shift();
        
        // queque browserify module alias
        var alias = 'build/debug/modules/' + name + '/index.js:' + name;
        if (grunt.config.data.browserify['build-features'].options.alias.indexOf(alias) === -1) {
            grunt.config.data.browserify['build-features'].options.alias.push(alias);
        }
        
        return content;
    }
    
    function onCopyFeatureFile(content, filePath) {   
        var feature = path.dirname(filePath).replace('src/features/','').split('/').shift();
        if (features.indexOf(feature) === -1) {
            features.push(feature);
        }
        
        // queque browserify module alias
        var alias = 'build/debug/features/' + feature + '/index.js:' + feature;
        if (grunt.config.data.browserify['build-features'].options.alias.indexOf(alias) === -1) {
            grunt.config.data.browserify['build-features'].options.alias.push(alias);
        }
        
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
        var lessBasePath = 'build/debug/features/**/index.less';
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
    
};
