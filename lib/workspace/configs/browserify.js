var extend = require('extend');

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

module.exports = configBrowserify;