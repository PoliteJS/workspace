
var WKS = require('../index');
var copyFilters = require('../lib/copy-filters');

module.exports = function(grunt) {
    
    grunt.registerTask('wkd-feature-assets', 'configure copy feature assets folder', function() {
        WKS.features.forEach(function(item) {
	    	grunt.config.data.copy['wkd-feature-assets'].files.push({
				expand: true,
				src: ['**'],
				cwd: 'src/features/' + item + '/assets',
				dest: 'build/debug/assets/' + item
			});
			grunt.config.data.copy['wkd-feature-assets-scripts'].files.push({
				expand: true,
				src: ['**'],
				cwd: 'src/features/' + item + '/assets',
				dest: 'build/debug/assets/' + item,
				filter: copyFilters.featureAssetsScripts
			});
    	});
    });
    
    
    // to create the release task
    grunt.registerTask('wkr-feature-assets', 'configure copy feature assets folder', function() {
        WKS.features.forEach(function(item) {
	    	grunt.config.data.copy['wkr-feature-assets'].files.push({
				expand: true,
				src: ['**'],
				cwd: 'src/features/' + item + '/assets',
				dest: 'build/release/assets/' + item
			});
			grunt.config.data.copy['wkr-feature-assets-scripts'].files.push({
				expand: true,
				src: ['**'],
				cwd: 'src/features/' + item + '/assets',
				dest: 'build/release/assets/' + item,
				filter: copyFilters.featureAssetsScripts
			});
    	});
    });
    
};
