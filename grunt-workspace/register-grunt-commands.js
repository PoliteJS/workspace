

module.exports = function(grunt) {
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-cleanempty');
    
    grunt.registerTask('build', [
        'politejs-workspace',
        'clean:wkd-main',
        'copy:wkd-assets',
        'copy:wkd-modules',
        'copy:wkd-features',
  		'copy:wkd-less-sources',
  		'copy:wkd-index-html',
        'copy:wkd-index-js',
        'copy:wkd-index-less',
        'wkd-feature-assets',
        'copy:wkd-feature-assets',
        'copy:wkd-feature-assets-scripts',
        'browserify:wkd',
        'less:wkd',
        'copy:wkd-sourcemap-js',
        'copy:wkd-sourcemap-less',
        'copy:wkd-less-css',
        'clean:wks-tmp'
    ]);
    
    grunt.registerTask('release', [
    	'build',
        'clean:wkr-before',
        'copy:wkr-assets',
        'copy:wkd-modules',
        'copy:wkd-features',
        'copy:wkd-less-sources',
        'copy:wkr-index-html',
        'wkr-feature-assets',
        'copy:wkr-feature-assets',
        'copy:wkr-feature-assets-scripts',
        'copy:wkd-index-js',
        'copy:wkd-index-less',
        'browserify:wkr',
        'less:wkr',
        'wkr-config-concat',
        'cssmin:wkr',
        'uglify:wkr-lib',
        'uglify:wkr-js',
        'wkr-clear-assets',
        'clean:wkr-after',
        'clean:wks-tmp',
        'cleanempty:wkr'
    ]);
        
    grunt.registerTask('develop', [
        'build',
        'wks-develop',
        'watch:wkd'
    ]);
    
    grunt.registerTask('test', [
        'build',
        'wks-karma-config',
        'wks-karma-build',
        'karma:wks-test'
    ]);
    
    grunt.registerTask('start-ci', [
        'build',
        'wks-karma-config',
        'wks-karma-build',
        'karma:wks-ci:start'
    ]);
    
    grunt.registerTask('ci', [
    	'build',
        'wks-karma-config',
        'wks-karma-build',
        'karma:wks-ci:run',
		'watch:wks-ci'
    ]);
    
    grunt.registerTask('install', [
        'politejs-workspace',
    	'wks-npm-install-config',
		'wks-npm-install-run',
    ]);
    
    grunt.registerTask('default', ['install','release']);
    
};
