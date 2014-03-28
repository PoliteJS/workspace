var WKS = require('../index');
var extend = require('extend');

function configUglify(grunt) {
    if (!grunt.config.data.uglify) {
        grunt.config.data.uglify = {};
    }
    grunt.config.data.uglify = extend(true, {
        options: WKS.config.release.uglify,
        'wkr-lib': {
            files: {}
        },
        'wkr-js': {
            files: {}
        }
    }, grunt.config.data.uglify);
}

module.exports = configUglify;