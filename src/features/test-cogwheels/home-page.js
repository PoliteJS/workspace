var router = require('cogwheels').router;
var layoutEngine = require('cogwheels').layoutEngine;


exports.init = function() {
    router.on('/', function() {
        var template = require('./template');
        var viewModel = require('./viewModel');
        layoutEngine.render(template, viewModel);
    });
};