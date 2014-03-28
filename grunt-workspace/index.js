
var tasks = [
    require('./tasks/wks-configure'),
    require('./tasks/wks-feature-assets'),
    require('./tasks/release'),
    require('./tasks/wks-npm-install'),
    require('./tasks/wks-karma'),
    require('./tasks/wks-develop'),
    require('./register-grunt-commands')
];


exports.init = function(grunt) {
    
    this.Grunt = grunt;
    
    // will build workspace blocks list
    this.features = [];
    this.modules = [];
    
    
    
    // register tasks
    tasks.forEach(function(task) {
        task(grunt);
    });
    
};

exports.grunt = function() {
    return this.Grunt;
};

exports.pushFeature = function(item) {
    if (this.features.indexOf(item) === -1) {
        this.features.push(item);
    }
};

exports.pushModule = function(item) {
    if (this.modules.indexOf(item) === -1) {
        this.modules.push(item);
    }
};
