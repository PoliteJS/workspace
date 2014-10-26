/**
 * PoliteJS Workspace
 * ==================
 *
 * gulp build
 * compile a development version of the project, debugging tools as
 * sourcemaps are available
 *
 * gulp test
 * run all the project's unit tests
 *
 * gulp dev
 * start a development session which keep the target folder up to date
 * by monitoring source changes and rebuilding the project in background
 *
 * gulp tdd
 * start a TDD session, all tests are executed as soon a source file change
 * or a test file is update with new tests.
 *
 * gulp start
 * compile, monitor and start debug server in background
 *
 */

var gulp = require('gulp');
var karma = require('karma');
var path = require('path');
var sequence = require('run-sequence');

// Setup Workspace
var wks = require('gulp-workspace');
wks.init(require('./workspace.conf.js')).start(gulp);

var appPath = wks.getConfig('source.path');
var assetsPath = path.join(wks.getConfig('source.path'), wks.getConfig('source.assets')); 

// Development API

gulp.task('default', ['show'], function() {});

gulp.task('build', function(done) {
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

gulp.task('dev', function(done) {
    sequence(
        'build',
        'watch',
        done
    );
});

gulp.task('show', function(done) {
    sequence(
        'build',
        'wks-server-show',
        done
    );
});

gulp.task('start', function(done) {
    sequence(
        'build',
        'wks-start',
        done
    );
});

gulp.task('test', function() {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        autoWatch: false
    });
});

gulp.task('tdd', function (done) {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js'
    }, done); 
});

// Partials Tasks (do not use those tasks alone)

gulp.task('wkd-build-js', function(done) {
    sequence(
        'wks-jshint',
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


