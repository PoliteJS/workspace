var WKS = require('../index');
var extend = require('extend');

function configKarma(grunt) {
    if (!grunt.config.data.karma) {
        grunt.config.data.karma = {};
    }
    grunt.config.data.karma = extend(true, {
        'wks-test' : {
            configFile: 'karma.conf.js',
            options: extend(true, WKS.config.karma.test, {
                singleRun: true,
                browsers: [
                    'PhantomJS'
//                        'Chrome', 
//                        'ChromeCanary', 
//                        'Firefox', 
//                        'Opera'
                ],
                reporters: [
                    'progress',
                    'coverage',
                    'osx'
                ],
                preprocessors: {}, // filled dinamically
                coverageReporter: {
                    type: 'html',
                    dir: 'build/coverage/'
                }
            })
        },
        'wks-ci' : {
            configFile: 'karma.conf.js',
            options: {
                singleRun: false,
                browsers: ['PhantomJS'],
                reporters: [
                    'progress',
                    'osx'
                ]
            }
        }
    }, grunt.config.data.karma);
}

module.exports = configKarma;