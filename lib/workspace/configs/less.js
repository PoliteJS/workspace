var extend = require('extend');

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

module.exports = configLess;