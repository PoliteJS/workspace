
var path = require('path');
var shell = require('shelljs');
var extend = require('extend');

module.exports = function(grunt) {
    
    grunt.registerTask('wks-npm-install-config', 'configure non-install task', function() {
        if (!grunt.config.data['wks-npm-install']) {
            grunt.config.data['wks-npm-install'] = {};
        }
        grunt.config.data['wks-npm-install-run'] = extend(true, {
            'wks-src' : {
                files: [{
                    expand: true, 
                    cwd: 'src/features',
                    src: ['*/package.json'],
                },{
                    expand: true, 
                    cwd: 'src/modules',
                    src: ['*/package.json'],
                }]
            }
        }, grunt.config.data['wks-npm-install']);
    });
    
    
    /**
     * Install a sub-folder npm dependencies
     */
    grunt.registerMultiTask('wks-npm-install-run', 'install NPM dependencies of /features and /modules', function() {
        this.filesSrc.forEach(function(filePath) {
            var pkg = grunt.file.readJSON(filePath);
            if (pkg.dependencies) {
                grunt.log.writeln('NPM INSTALL: ', path.dirname(filePath));
                var folderPath = process.cwd() + '/' + path.dirname(filePath);
                shell.exec('cd ' + folderPath + ' && npm install');
            }
        });
    });
    
};
