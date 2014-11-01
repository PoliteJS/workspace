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
        
        // you can organize you features in sub-folders by changing this option to be an array.
        features: 'features',
        
        // by default you write your javascript entry points beside the HTML files
        // but you can move them into a sub-folder if you prefer.
        scripts: '.',
        
        // by default you write your CSS entry points beside the HTML files
        // but you can move them into a sub-folder if you prefer.
        //
        // NOTE: this can be the same folder used for Javascript entry points!
        styles: '.'
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
