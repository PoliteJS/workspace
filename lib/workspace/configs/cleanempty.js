var extend = require('extend');

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

module.exports = configCleanempty;