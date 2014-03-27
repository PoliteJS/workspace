
/**
 * Import Grunt Instance
 */

var WKS = require('../index');

exports.excludeLess = function(filePath) {
    return filePath.indexOf('.less') === -1;
};


/**
 * Copy only source files
 * - html
 * - js
 * - css
 * - less
 */
exports.testFilesOnly = function(filePath) {
    filePath = filePath.toLocaleLowerCase();
    
    if (filePath.indexOf('.json') !== -1) {
        return false;
    }
    
    var status = false;
    ['.js','.html','.css','.less'].forEach(function(test) {
        if (filePath.indexOf(test) !== -1) {
            status = true;
        }
    });
    
    return status;
};

exports.featureTemplates = function(filePath) {
    if (filePath.indexOf('/features/') !== -1) {
        return false;
    } else {
        return true;
    }
};

exports.featureAssetsScripts = function(filePath) {
    if (filePath.indexOf('.css') !== -1 || filePath.indexOf('.js') !== -1) {
        return true;
    } else {
        return false;
    }
};

