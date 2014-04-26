var WKS = require('../index');
var childProcess = require('child_process');

module.exports = function(grunt) {
    
    
    
    grunt.registerMultiTask('wks-debug-server', 'run debug server', function() {
        
        var next = this.async();
        
        var options = this.options();
        options.args = options.args || 8080;
        
        var server = childProcess.exec('node lib/workspace/debug-server.js ' + options.args, function() {});
        
        server.stdout.on('data', function(data) {
            console.log(data);
        });
        
        server.on('exit', next);
        
    });
    
};
