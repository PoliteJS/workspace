
var WKS = require('../index');
var path = require('path');

var aliases = [];

exports.addByPath = function(filePath, type) {
    
    if (filePath.indexOf('package.json') !== -1) {
        return;
    }
    
    var grunt = WKS.Grunt;
    var mode = '';
    var moduleName = path.dirname(filePath).replace('src/' + type + '/','').split('/').shift();

    // try to read module's package.json to search submodules to export
    var pkgPath = 'src/' + type + '/' + moduleName + '/package.json';
    if (grunt.file.exists(pkgPath)) {
        var pkgObj = grunt.file.readJSON(pkgPath);
        if (pkgObj.exports === true) {
            mode = 'FULL';
        } else if ((typeof pkgObj.exports === 'object' && typeof pkgObj.exports.push === 'function') || (typeof pkgObj.globals === 'object' && typeof pkgObj.globals.push === 'function')) {
            mode = [moduleName];
            if (pkgObj.exports) {
                pkgObj.exports.forEach(function(subModule) {
                    mode.push(moduleName + '/' + subModule);
                });
            }
            if (pkgObj.globals) {
                pkgObj.globals.forEach(function(subModule) {
                    mode.push(moduleName + '/' + subModule);
                });
            }
        }
    }

    // exports all single sub items of a module
    if (mode) {

        // support HTML templates
        if (filePath.indexOf('.html') !== -1) {
            filePath = filePath.replace('.html', '.js');
        }

        var modulePath = filePath.replace('src/' + type + '/','');
        if (modulePath.indexOf('.js') !== -1 ) {
            var scriptName = modulePath.substr(modulePath.lastIndexOf('/')+1, modulePath.lastIndexOf('.')-modulePath.lastIndexOf('/')-1);
            if (scriptName === 'index') {
                scriptName = modulePath.substr(0, modulePath.lastIndexOf('/'));
            } else {
                scriptName = modulePath.substr(0, modulePath.lastIndexOf('.'));
            }
            // export alias, try also to export globals sub modules of a package
            if (mode === 'FULL' || mode.indexOf(scriptName) !== -1) {
                var subName = scriptName.substring(moduleName.length+1, scriptName.length);
                if (pkgObj && pkgObj.globals && pkgObj.globals.indexOf(subName) !== -1) {
                    this.pushAlias('build/app/' + type + '/' + modulePath+':'+subName);
                } else {
                    this.pushAlias('build/app/' + type + '/' + modulePath+':'+scriptName);
                }

            }
        }

    // exports only the module name, all internal pieces are masked
    } else {
        this.pushAlias('build/app/' + type + '/' + moduleName + '/index.js:' + moduleName);
    }
    
};


exports.pushAlias = function(alias) {
    aliases.push(alias);
    
    // TEMPORARY
    browserifyAddAlias(WKS.Grunt, alias);
};

// TEMPORARY
function browserifyAddAlias(grunt, alias) {
    grunt.config.data.browserify.wkd.options.alias.push(alias);
    grunt.config.data.browserify.wkr.options.alias.push(alias);
}



exports.getAliases = function() {
    return aliases;
};