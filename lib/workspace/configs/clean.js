var extend = require('extend');

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

module.exports = configClean;