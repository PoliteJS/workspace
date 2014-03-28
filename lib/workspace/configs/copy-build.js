
var extend = require('extend');


// internal helpers
var copyFilters = require('../lib/copy-filters');
var copyCallbacks = require('../lib/copy-callbacks');



module.exports = function(grunt) {
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
        'wkr-modules' : {
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
        'wkr-features' : {
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
};