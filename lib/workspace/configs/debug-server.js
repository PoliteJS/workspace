var WKS = require('../index');
var extend = require('extend');

function configDebugServer(grunt) {
    if (!grunt.config.data['wks-debug-server']) {
        grunt.config.data['wks-debug-server'] = {};
    }
    grunt.config.data['wks-debug-server'] = extend(true, {
        'wkd': {
            options: {
                args: '8080'
            }
        },
        'wkr': {
            options: {
                args: '-r 8080'
            }
        }
    }, grunt.config.data['wks-debug-server']);
}

module.exports = configDebugServer;