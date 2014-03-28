
var extend = require('extend');


// internal helpers
var copyFilters = require('../lib/copy-filters');
var copyCallbacks = require('../lib/copy-callbacks');


module.exports = function(grunt) {
    
    grunt.registerTask('wks-configure', 'PoliteJS Workspace Configure', function() {
        
        var options = this.options();
        
        configClean(grunt);
        configCopy(grunt);
        configBrowserify(grunt);
        configLess(grunt);
        configCssmin(grunt);
        configUglify(grunt);
        configCleanempty(grunt);
    
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
                filter: copyFilters.excludeLess
            }]
        },
        'wkr-assets' : {
            files: [{
                expand: true, 
                cwd: 'src/assets',
                src: ['**'], 
                dest: 'build/release/assets',
                filter: copyFilters.excludeLess
            }]
        },
        'wkd-modules' : {
            files: [{
                expand: true, 
                cwd: 'src/modules',
                src: ['**'], 
                dest: 'build/app/modules'
            }],
            options: {
                process: copyCallbacks.onCopyModules
            }
        },
        'wkd-features' : {
            files: [{
                expand: true, 
                cwd: 'src/features',
                src: ['**/*'], 
                dest: 'build/app/features',
                filter: copyFilters.testFilesOnly,
                rename: copyCallbacks.onCopyFeaturesRename
            }],
            options: {
                process: copyCallbacks.onCopyFeatures
            }
        },
        'wkd-less-sources' : {
            files: [{
                expand: true, 
                cwd: 'src',
                src: ['**/*.less'],
                dest: 'build/app'
            }],
            options: {
                process: copyCallbacks.onCopyLessFiles
            }
        },
        'wkd-index-html' : {
            files: [{
                expand: true, 
                cwd: 'src',
                src: ['**/*.html'], 
                dest: 'build/debug',
                filter: copyFilters.featureTemplates
            }],
            options: {
                process: copyCallbacks.onCopyIndexHtml
            }
        },
        'wkr-index-html' : {
            files: [{
                expand: true, 
                cwd: 'src',
                src: ['**/*.html'], 
                dest: 'build/release',
                filter: copyFilters.featureTemplates
            }],
            options: {
                process: copyCallbacks.onCopyIndexHtmlForRelease
            }
        },
        'wkd-index-js' : {
            files: [{
                expand: true,
                cwd: 'src',
                src: ['index.js'], 
                dest: 'build/app'
            }],
            options: {
                process: copyCallbacks.onCopyIndexJs
            }
        },
        'wkd-index-less' : {
            files: [{
                expand: true, 
                cwd: 'src',
                src: ['index.less'], 
                dest: 'build/app'
            }],
            options: {
                process: copyCallbacks.onCopyIndexLess
            }
        },
        'wkd-feature-assets' : {
            files: []
        },
        'wkr-feature-assets' : {
            files: []
        },
        'wkd-feature-assets-scripts' : {
            files: [],
            options: {
                process: copyCallbacks.onCopyFeatureAssetsScripts
            }
        },
        'wkr-feature-assets-scripts' : {
            files: [],
            options: {
                process: copyCallbacks.onCopyFeatureAssetsScriptsForRelease
            }
        },
        'wkd-sourcemap-js' : {
            files: [{
                expand: true, 
                cwd: 'build/app',
                src: ['features.debug.js'], 
                dest: 'build/debug/assets/js'
            }],
            options: {
                process: copyCallbacks.onCopyJsSourcemap
            }
        },
        'wkd-sourcemap-less' : {
            files: [{
                expand: true, 
                cwd: 'build/app',
                src: ['features.debug.css.map'], 
                dest: 'build/debug'
            }],
            options: {
                process: copyCallbacks.onCopyCssSourcemap
            }
        },
        'wkd-less-css' : {
            files: [{
                expand: true, 
                cwd: 'build/app',
                src: ['features.debug.css'], 
                dest: 'build/debug/assets/css'
            }],
            options: {
                process: copyCallbacks.onCopyLessCss
            }
        }
    }, grunt.config.data.copy);
}

function configBrowserify(grunt) {   
    if (!grunt.config.data.browserify) {
        grunt.config.data.browserify = {};
    }
    grunt.config.data.browserify = extend(true, {
        wkd: {
            files: {
                'build/app/features.debug.js' : ['build/app/index.js']
            },
            options: {
                bundleOptions : {
                    debug: true
                },
                alias: []
            }
        },
        wkr: {
            files: {
                'build/release/assets/js/features.js' : ['build/app/index.js']
            },
            options: {
                alias: []
            }
        }
    }, grunt.config.data.browserify);
}

function configLess(grunt) {   
    if (!grunt.config.data.less) {
        grunt.config.data.less = {};
    }
    grunt.config.data.less = extend(true, {
        wkd: {
            files: {
                'build/app/features.debug.css' : ['build/app/index.less']
            },
            options: {
                sourceMap: true,
                sourceMapFilename: 'build/app/features.debug.css.map'
            },
        },
        wkr: {
            files: {
                'build/release/assets/css/features.css' : ['build/app/index.less']
            }
        }
    }, grunt.config.data.less);
}

function configCssmin(grunt) {
    if (!grunt.config.data.cssmin) {
        grunt.config.data.cssmin = {};
    }
    grunt.config.data.cssmin = extend(true, {
        wkr: {
            files: {}
        }
    }, grunt.config.data.cssmin);
}

function configUglify(grunt) {
    if (!grunt.config.data.uglify) {
        grunt.config.data.uglify = {};
    }
    grunt.config.data.uglify = extend(true, {
        options: {
            mangle: false,
            compress: false,
            beautify: true
        },
        'wkr-lib': {
            files: {}
        },
        'wkr-js': {
            files: {}
        }
    }, grunt.config.data.uglify);
}

function configCleanempty(grunt) {
    if (!grunt.config.data.cleanempty) {
        grunt.config.data.cleanempty = {};
    }
    grunt.config.data.cleanempty = extend(true, {
        wkr: {
            src: ['build/release/**/*']
        }
    }, grunt.config.data.cleanempty);
}

