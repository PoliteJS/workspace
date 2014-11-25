/**
 * PoliteJS Workspace
 * ==================
 *
 * gulp show
 * vuild the project, start the server and show it up in the default browser
 *
 * gulp build
 * compile a development version of the project, debugging tools as
 * sourcemaps are available
 *
 * gulp start
 * compile, monitor and start debug server in background
 *
 * gulp dev
 * start a development session which keep the target folder up to date
 * by monitoring source changes and rebuilding the project in background
 *
 * gulp init-tdd
 * install KarmaJS test suite 
 * you need to do this once before to start unit testing
 *
 * gulp test
 * run all the project's unit tests
 *
 * gulp tdd
 * start a TDD session, all tests are executed as soon a source file change
 * or a test file is update with new tests.
 *
 */

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var sequence = require('run-sequence');

// Setup Workspace
var wks = require('gulp-workspace');
wks.init(require('./workspace.conf.js')).start(gulp);

var appPath = wks.getConfig('source.path');
var assetsPath = path.join(wks.getConfig('source.path'), wks.getConfig('source.assets')); 

// Development API

gulp.task('default', ['show'], function() {});

gulp.task('show', ['build'], function(done) {
    sequence(
        'wks-server-show',
        done
    );
});

gulp.task('start', ['build'], function(done) {
    sequence(
        'wks-start',
        done
    );
});

gulp.task('dev', ['build'], function(done) {
    sequence(
        'watch',
        done
    );
});

gulp.task('build', ['wks-jshint'], function(done) {
    sequence(
        'wkd-clean',
        'wkd-build-js',
        'wkd-build-css',
        'wkd-build-html',
        done
    );
});

gulp.task('watch', function() {
    gulp.watch([
        appPath + '/*.html'
    ], ['wkd-build-html']);
    gulp.watch([
        assetsPath + '/**/*.*'
    ], ['wkd-rebuild-html']);
    gulp.watch([
        appPath + '/**/*.js',
        appPath + '/**/*.html',
        appPath + '/**/*.json'
    ], ['wkd-build-js']);
    gulp.watch([
        appPath + '/**/*.less',
        appPath + '/**/*.css'
    ], ['wkd-build-css']);
});

// Tests tasks are available only "on demand"

gulp.task('init-tdd', function(done) {
    sequence(
        'wks-install-karma',
        done
    );
});

if (fs.existsSync(path.join(__dirname, 'node_modules/karma'))) {
    var karma = require('karma');
    gulp.task('test', ['wks-jshint'], function() {
        karma.server.start({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true,
            autoWatch: false
        });
    });
    gulp.task('tdd', ['wks-jshint'], function (done) {
        karma.server.start({
            configFile: __dirname + '/karma.conf.js'
        }, done); 
    });
}

// Partials Tasks (do not use those tasks alone)

gulp.task('wkd-build-js', ['wks-jshint'], function(done) {
    sequence(
        'wkd-webpack',
        done
    );
});

gulp.task('wkd-build-css', function(done) {
    sequence(
        'wkd-less',
        done
    );
});

gulp.task('wkd-build-html', function(done) {
    sequence(
        'wkd-copy-assets',
        'wkd-copy-html',
        done
    );
});

gulp.task('wkd-rebuild-html', function(done) {
    sequence(
        'wkd-clean-libs',
        'wkd-clean-assets',
        'wkd-copy-assets',
        'wkd-copy-html-hard',
        done
    );
});


