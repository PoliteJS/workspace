var extend = require('extend');

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

module.exports = configCssmin;