/**
 * PoliteJS Workspace
 * ==================
 * 
 * Modify this file if you need to customise Workspace behaviour or your 
 * folder names and structure.
 *
 * All the options are listed here with their default values and a
 * detailed comment description
 *
 */

module.exports = {
    
    source: {
        // app source folder base name
        path: 'app',
        
        // assets folder within your app source folder
        assets: 'assets',
        
        // webpack modules entry point folder within your app source folder
        // NOTE: you can add many modules entry points folders by changing this settings to be an array
        modules: 'modules',
        
        // javascript entry points folder within your app source folder
        scripts: 'entry-points',
        
        // css entry points folder within your app source folder
        styles: 'entry-points'
    },
    
    target: {
        dev: {
            path: 'build/dev'
        }
    },
    
    server: {
        dev: {
            port: 8080,
            compress: true
        }
    },
    
    /**
     * Forward specific webpack configurations
     */
    webpack: require('./webpack.config.js'),
};
