/**
 * PoliteJS Workspace
 */

module.exports = function (grunt) {
    
    // Initialize PoliteJS Workspace
    var Workspace = require('./grunt-workspace');
    Workspace.init(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
        
        // Configure PoliteJS Workspace
        'politejs-workspace': {
            options: {}
        } 
		
	});
    
};
