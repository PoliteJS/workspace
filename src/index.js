/**
 * PoliteJS Worspace - Single Page App Builder
 * ===========================================
 * 
 * 
 */

var features = [/*FEATURES*/];

/**
 * Features Init
 */
features.forEach(function(feature) {
    if (feature.init) {
        feature.init();
    }
});

/**
 * Features Start
 */
features.forEach(function(feature) {
    if (feature.start) {
        feature.start();
    }
});

/**
 * Export `require()` to the global namespace
 */
window.require = require;
