var router = require('cogwheels').router;
var layoutEngine = require('cogwheels').layoutEngine;

exports.init = function() {
    router.on('/testRoute', function() {
        layoutEngine.render('<p>Router works!</p>');
    });
};
