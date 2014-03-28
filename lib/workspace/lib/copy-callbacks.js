
var path = require('path');

var WKS = require('../index');
var browserifyAlias = require('./browserify-alias');




exports.onCopyModules = function(content, filePath) {
    
    // queue module name
    var name = path.dirname(filePath).replace('src/modules/','').split('/').shift();
    WKS.pushModule(name);
    
    // create browserify alias 
    browserifyAlias.addByPath(filePath, 'modules');
    
    return content;
};

exports.onCopyFeatures = function(content, filePath) {
    
    // queue feature name
    var name = path.dirname(filePath).replace('src/features/','').split('/').shift();
    WKS.pushFeature(name);

    // create browserify alias 
    browserifyAlias.addByPath(filePath, 'features');

    // transform template.html files into CommonJS modules
    if (filePath.indexOf('.html') !== -1) {
        var tmp = 'module.exports = [';
        var rows = [];
        content.split('\n').forEach(function(row) {
            rows.push('unescape("' + escape(row) + '")');
        });
        content = tmp + rows.join(',') + '].join(\'\\n\');';
    }

    return content;
};

exports.onCopyFeaturesRename = function(dest, src) {
    if (src.indexOf('.html') !== -1) {
        return dest + '/' + src.replace('.html', '.js');
    } else {
        return dest + '/' + src;
    }
};

exports.onCopyLessFiles = function(content, filePath) {
    var found = false;
    WKS.features.forEach(function(feature) {
        if (filePath.indexOf('/' + feature + '/') !== -1) {
            content = content.replace(/feature:\/\//g, '../' + feature + '/');
            content = content.replace(/assets:\/\//g, '../');
            found = true;
        }
    });
    if (found === false) {
        content = content.replace(/assets:\/\//g, '../');
    }
    return content;
};

exports.onCopyIndexHtml = function(content) {
    content = content.replace('<!--[/CSS]-->', '<link rel="stylesheet" href="./assets/css/features.debug.css" /><!--[/CSS]-->');
    content = content.replace('<!--[/JS]-->', '<script src="./assets/js/features.debug.js"></script><!--[/JS]-->');
    return content;
};

exports.onCopyIndexHtmlForRelease = function(content) {
    content = content.replace('<!--[/CSS]-->', '<link rel="stylesheet" href="./assets/css/features.css" /><!--[/CSS]-->');
    content = content.replace('<!--[/JS]-->', '<script src="./assets/js/features.js"></script><!--[/JS]-->');
    return content;
};

exports.onCopyIndexJs = function(content, filePath) {
    if (WKS.features.length) {
        content = content.replace('/*FEATURES*/', "require('" + WKS.features.join("'),require('") + "')");
    }
    return content;
};

exports.onCopyIndexLess = function(content, filePath) {
    var lessBasePath = 'build/app/features/**/index.less';
    var replaceWith = '';
    WKS.features.forEach(function(feature) {
        var lessFeaturePath = lessBasePath.replace('**', feature);
        if (WKS.Grunt.file.exists(lessFeaturePath)) {
            replaceWith += '@import "features/' + feature + '/index.less";';
        }
    });
    content = content.replace('/*FEATURES*/', replaceWith);
    content = content.replace(/assets:\/\//g, '../'); // support assets link
    return content;
};

exports.onCopyFeatureAssetsScripts = function(content, filePath) {
    content = content.replace(/feature:\/\//g, '../');
    content = content.replace(/assets:\/\//g, '../../');
    return content;
};

exports.onCopyFeatureAssetsScriptsForRelease = function(content, filePath) {
    var feature = filePath.split('/features/')[1].split('/')[0];
    content = content.replace(/feature:\/\//g, '../' + feature + '/');
    content = content.replace(/assets:\/\//g, '../');
    return content;
};

exports.onCopyJsSourcemap = function(content, filePath) {
    var b64Start = content.indexOf('//# sourceMappingURL=') + '//# sourceMappingURL=data:application/json;base64,'.length;
    var b64Src = content.substr(b64Start, content.length);
    var plain = new Buffer(b64Src, 'base64').toString('ascii');

    var re = new RegExp(process.cwd(), 'g');
    plain = plain.replace(re, '');
    plain = plain.replace(/\"\/build\/app\//g, '"/src/');

    content = content.replace(b64Src, new Buffer(plain).toString('base64'));
    return content;
};

exports.onCopyCssSourcemap = function(content, filePath) {
    content = content.replace(/\"build\/app/g, '"/src');
    return content;
};

exports.onCopyLessCss = function(content, filePath) {
    content = content.replace('sourceMappingURL=build/app/', 'sourceMappingURL=../../');
    return content;
};



