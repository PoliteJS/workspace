/**
 * PoliteJS Workspace
 * ==================
 * 
 * configuration file
 *
 */

module.exports = {
    source: {
        path: 'app',
        assets: 'assets',
		modules: 'modules',
		scripts: 'core',
        styles: 'core'
    },
    target: {
        dev: {
            path: 'build/dev'
        }
    },
    // subModules: [
    //     'application',
    //     'domain',
    //     'ko-bindings',
    //     'ko-components',
    //     'utils'
    // ],
    webpack: require('./webpack.config.js'),
};
