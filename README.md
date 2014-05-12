PoliteJS's Single Page App Workspace
====================================

    1. Install Dependencies
    > npm install && grunt
    
    2. Run Debug Server
    > grunt server
    
    3. Start a Development session (in a new terminal tab)
    > grunt develop
    
> This is a very early release which works but lack in documentation.  
> We are working hard to reach a first stable version, please contribute!
u

## Workspace

The _Workspace_ is a _GruntJS_ setup which combines a lot of nice existing tools to provide you with **a clever project organization and code structure in order to increase productivity**.

> The _Workspace_ takes **heavy inspiration** from a framework which 
> is used internally in Mobenga AB, the company I work with. 
>
> This repository aim to bring some good concept we use to the OpenSource world!  
> **I really want to credit Mobenga AB and my colleagues Markus, Robert and Tomas for the great job we do together!**

### Folder Structure

A typical _Workspace_ folder structure should be:

    package.json
    Gruntfile.js
    karma.conf.js
    src/
        index.html
        index.js
        index.less
        assets/
            img/
            css/
            js/
        features/
        modules/
    build/
        debug/
        release/

You write you app source files in `src/` then the building process creates two runnable versions of your app in `build/`. 

A first `debug/` build is filled with uncompressed files, source maps and other testing facilities.

A `release/` build contains the **optimized and _ready to deploy_ app**, concatenation, minification, caching and assets inlining are applied just out of the box.

### App's Entry Points

The _Workspace_ is used to create **HTML5 Single Page Applications** so you have 3 main entry points for your application:

- index.html
- index.js
- index.less

Into the `index.html` file you will find some **placeholder comments** for both CSS and JS:

    <!--[CSS]-->
    place you custom style links here
    <!--[/CSS]-->
    
    <!--[JS]-->
    place your custom script links here
    <!--[/JS]-->
    
> Those placeholders are used by the _Workspace_ building process to concatenate and optimize your source files!

In both `index.js` and `index.less` you will find the `/*FEATURES*/` **placeholder** which is used to automagically include all the features you will create within your application's assets.



### Features

**A _Feature_ represents a slice of your application** and should wrap some responsibilities or should implement a story from your backlog. 

> It's up to you to understand how to use features the most productive way!

A Feature can contain:

- _Javascript_ logic
- _LESS_ rules
- _HTML_ templates
- static assets
- unit tests
- `package.json` dependency manifest


### Modules

A _Module_ is a fully reusable piece of _Javascript_.

It should implements a single function or a complex library and should be composed by a great amount of **little sub-modules** just like the _NodeJS_ way.

A Module can contain:

- _Javascript_ logic
- unit tests
- `package.json` dependency manifest

### NPM Dependencies

The _Workspace_ allow to install, require and **use any compatible _NPM Modules_**. 

Application folder and any _Features_ or _Modules_ should expose a `package.json` manifest in which to list some dependencies.

> The building process tries to resolve all _Features_ and 
> _Modules_ dependencies before to build the App!

By instance you can easily use _jQuery_ by loading it from _NPM_:
    
    // from you project's root
    npm install jquery --save
    
then require it from your javascript entry point:
    
    // src/index.js
    window.$ = require('jquery');

A feature or a module should also depend on other modules and should contain an internal `package.json` where to list such dependencies.

    // install/check all features and modules dependencies
    grunt install
    
The command above step into all the project's features and modules and install (via `npm install`) all the listed dependencies.

### Sub Modules

By default _Workspace_ makes available each folder under `src/features` and `src/modules` as a _require compatible namespace_ so you can run the following command from the _window_ scope:
    
    // "src/modules/module-name" should be referred as:
    require('module-name').exportedAPI
    
You can also expose some sub-modules in order to run:

    // use "src/modules/module-name/sub-module.js" as:
    require('module-name/sub-module').exportedAPI
    
To make above code to work you need to export each sub-module declaring it in module's `package.json` file:

    // module-name/package.json
    {
      "exports" : [
        "sub-module",
        "sub-module/sub-sub",
      ]
    }
    
> Use the `"exports" : true` shortcut to expose all sub-modules!

You can also expose a sub-module to the global scope:

    // module-name/package.json
    {
      "globals" : [
        "sub-module"
      ]
    }
    
    // somewhere around the code
    require('sub-module');
    
This should be useful for big packages to expose their modules to the global scope <small>(like a framework package)</small>.

> **IMPORTANT!**  
> To pollute the global scope should produce unpredictable outcomes.  
> **Do it very carefully!**

## Use assets in LESS Sources

When you write a _LESS_ source file you may want to link some static images as backgrounds or to create some _FontFace_ rules:

    // map to "src/assets" folder
    background: url(assets://img/file.jpg)
    
    // map to a "featureName/assets" folder
    background: url(feature://img/file.jpg)
    
> Both `feature://` and `assets://` works also for feature's static CSS, 
> but you are encouraged to switch to _LessCss_ to write your stylesheets.

## JS: Debug Code Scope

Often you need to write **debug code which you wish to be automatically removed** from the release version. 

Well the _Workspace_ introduces the concept of **comment-to-code** which is basically _Javascript_ code within comments:

    // next line will run everywhere:
    console.log('everywhere');
    
    // next line will run only debug build:
    /*D console.log('only for debugging eyes'); */

> Comment's code is **evaluated in the debug build** but is stripped out at release time.

## Testing With Karma

You can add specification tests to both `src/features` and `src/modules`:

    // feature-name/specs/test.spec.js
    describe('my Feature', function() {
        it('should start', function() {
            expect(
                require('feature-name').start
            ).to.be.a('function');
        });
    });

Then you can run all your tests with the _Grunt_ task:

    grunt test
    
You can also start a **Continuous Integration** environment to quickly run tests when a new
build is made:

    // terminal 1: start a Karma server instance
    grunt start-ci
    
    // terminal 2: run tests after every build
    grunt ci
    
## Development Server

During development you may want to **run your _web app_ through a _web server_** in order to better simulate the production environment.

The _Workspace_ comes with a simple _Express_ based server which can be user for both **debug** and **release** build:

    grunt server
   
This default configuration run an _HTTP Server_ available at `http://localhost:8080` serving your `build/debug` folder.

> It provides also a full _sourcemaps_ support in order to **debug your app to the 
> source files** for both _Javascript_ and _LESS_ sources.

You can configure a custom port in the `Gruntfile.js` config:

    'wks-debug-server' : {
      wkd : {
        options: {
          args: '1234'
        }
      }
    }
    
When you are ready to test your production ready release you can run the server in _release mode_ which means your `build/release` folder is served and no cache prevention are done:

    grunt server-release
    
You can specify your desired port also for the release mode:

    'wks-debug-server' : {
      wkr : {
        options: {
          args: '1234'
        }
      }
    }
    
## Workspace Config Options
    
    /**
     * Workspace Configuration
     */
    'workspace': {
        options: {
            minifyTemplates: false,
            release: {
                uglify: {
                    beautify: true,
                    compress: false,
                    mangle: false
                },
                minifyHtml: false,
                inline: {
                    css: false,
                    js: false
                },
                manifest: {
                    filename: 'appcache',
                    exclude: [
                        '/assets/readme.txt',    // exclude file path
                        '/assets/css/images/**'  // exclude an entire folder
                    ]
                }
            },
            karma: {
                test: {
                    browsers: [
                        'PhantomJS',
                        'Chrome', 
                        'ChromeCanary', 
                        'Firefox', 
                        'Opera'
                    ]
                }
            }
        }
    }
