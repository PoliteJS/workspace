
var tasks = [
    require('./tasks/wks-configure')
];

exports.init = function(grunt) {
    
    // register tasks
    tasks.forEach(function(task) {
        task(grunt);
    });
    
};

exports.filters = require('./lib/copy-filters');
