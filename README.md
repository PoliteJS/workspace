PoliteJS's Single Page App Workspace
====================================

    1. Install Dependencies
    > npm install && grunt
    
    2. Run Debug Server
    > node server.js
    
    3. Start Development Observer
    > grunt develop
    
    4. Release Your App
    > grunt release
    
> This is a very early release which works but lack in documentation.  
> We are working hard to reach a first stable version, please contribute!


## Workspace

The _Workspace_ is basically a _GruntJS_ setup which combine a lot of nice existing tools to provide you with **a good project organization and code structure in order to increase productivity**.

> The _Workspace_ take **heavy inspiration** from a framework used internally in
> Mobenga AB, the company I work with. 
>
> This repository wants to bring some good concept we use to the OpenSource world!  
> **I really want to credit Mobenga AB and my colleagues Markus, Robert and Tomas!**

### Folder Structure

A typical _Workspace_ folder structure should be as follow:

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
    lib/workspace/

### Features

A _feature_ represent a piece of your application and should wrap some responsabilities or should implement a story from your backlog. 

> It's up to you to understan how to use feature the most productive way!

A feature should contain:

- _Javascript_ logic
- _LESS_ rules
- _HTML_ templates
- static assets


### Modules

A _module_ is a fully reusable piece of _Javascript_. 

It should implement a single function or a complex library and should be composed by a great amount of **little sub-modules** just the _NodeJS_ way.

### node_modules

The _Workspace_ allow to distribute both _features_ and _modules_ as pure _NPM_ dependencies listed in the app's `package.json`.

A feature or a module should also depend on other modules and should contain an internal `package.json` where to list such dependencies.

    // install all features and modules dependencies
    grunt install
    
The command above step into all the project's features and modules and install (via `npm install`) all the listed dependencies.

### Sub Modules

By default _Workspace_ makes available each folder under `src/features` and `src/modules` as a 
_require_ module so you can run the following command from the _window_ namespace:

    require('module-name').exportedAPI
    
You can also expose some sub-modules in order to run:

    // module-name/sub-module.js
    require('module-name/sub-module').exportedAPI
    
You can export sub-modules by editing the module's `package.json` file:

    // module-name/package.json
    {
      "exports" : [
        "sub-module",
        "sub-module/sub-sub",
      ]
    }
    
> **NOTE:** use the `"exports" : true` shortcut to expose all sub-modules!

You can also expose a sub-module to the global scope:

    // module-name/package.json
    {
      "globals" : [
        "sub-module"
      ]
    }
    
    // somewhere around the code
    require('sub-module');
    
This should be useful for big packages to expose their modules to the global scope (like a little framework).

> To pollute the global scope should produce a really messy situation.  
> **Do it very carefully!**

## Use Images in LESS Sources

When you write a _LESS_ source you may want to link some static image as backgrounds:

    // map to src/assets folder
    background: url(assets://img/file.jpg)
    
    // map to a featureName/assets folder
    background: url(feature://img/file.jpg)
    
> both `feature://` and `assets//` works also for feature's static CSS, but you are 
> encouraged to switch to _LESS_ to write your stylesheets.

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
    
You can also start a **Continuous Integration** enviroment to quickly run tests when a new
build is made:

    // terminal 1: start a Karma server instance
    grunt start-ci
    
    // terminal 2: run tests after every build
    grunt ci
    
## Development Server

During development you may want to **run your _web app_ through a _web server_** in order to better simulate the production environment.

The _Workspace_ comes with a simple _Express_ based server which can be user for both **debug** and **release** build:

    node server.js
   
This default configuration run an _HTTP Server_ available at `http://localhost:8080` serving your `build/debug` folder.

> It provides also a full _sourcemaps_ support in order to **debug your app to the 
> source files** for both _Javascript_ and _LESS_ sources.

If you want to change the port you can give your preference as param:

    node server.js 1234
    
When you are ready to test your production ready release you can run the server in _release mode_ which means your `build/release` folder is served and no cache prevention are done:

    node server.js -r
    
You can specify your desider port also for the release mode:

    node server.js -r 1234