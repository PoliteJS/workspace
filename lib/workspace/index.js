
var tasks = [
    require('./tasks/wks-configure'),
    require('./tasks/wks-feature-assets'),
    require('./tasks/wks-npm-install'),
    require('./tasks/wks-karma'),
    require('./tasks/wkr-concat'),
    require('./tasks/wkr-cache-manifest'),
    require('./tasks/wkr-inline-assets'),
    require('./tasks/wkr-minify-html')
];


exports.init = function(grunt) {
    
    this.Grunt = grunt;
    
    this.config = {
        minifyTemplates: {
            removeComments : true,
            collapseWhitespace : true,
            removeAttributeQuotes : true,
            removeEmptyAttributes : true
        },
        debug: {},
        release: {
            minifyHtml: {
                removeComments : true,
                collapseWhitespace : true,
                removeAttributeQuotes : true,
                removeEmptyAttributes : true
            },
            uglify: {}
        },
        karma: {
            test: {},
            ci: {}
        }
    };
    
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
