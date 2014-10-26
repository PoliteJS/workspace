// Karma configuration
// Generated on Tue Aug 05 2014 14:21:29 GMT+0200 (Västeuropa, sommartid)

module.exports = function(config) {
    
    // PoliteJS Workspace Integration
    // files and preprocessors are added automatically by the Workspace
	config.set(require('gulp-workspace').init(require('./workspace.conf.js')).karmaConf({
        
        // base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',
        
        // frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon'],

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],
        
        // test results reporter to use
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'progress',
            'coverage', 
            'osx'
        ],
        
        // configure the way Karma reports the code coverage analysys
        coverageReporter: {
            reporters: [
                { type: 'html', dir: 'coverage' },
                { type: 'text-summary'}
            ]
        },

        // list of files / patterns to load in the browser
        // IMPORTANT: this list is automatically filled up by Workspace
        files: [],
        
        // list of files to exclude
        exclude: [],
        
        // preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        // IMPORTANT: this list is automatically filled up by Workspace
        preprocessors: {},
        
        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN
    }));
};