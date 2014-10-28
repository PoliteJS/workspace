PoliteJS Workspace - <small>Gulp Edition</small>
=================================

PoliteJS [_Workspace_][wks] is a [_GulpJS_][gulp] setup which combines a lot of existing 
**Open Source** modules to provide you with a clever project organization and 
code structure in order to **increase web development productivity**.

> In order to run the follwing Quick Start scripts you need 
> [NodeJS][node] and [NPM][npm] up and runnin on your computer.
> You also need [GulpJS][gulp] installed globally.

    // install Gulp (if you don't have it yet)
    npm install -g gulp
    
    // quick project startup
    npm install && gulp
    
## Folder Structure

    /project-root
      /app                  web app' source files
      /build                compiler output
      /node_modules         dependencies packages
      - workspace.conf.js
      - webpack.config.js
      - karma.conf.js
      - Gulpfile.js

The most important folder is `/app/` in which you place and edit all the source
files for your web project. 

## Building and Coding the App

The [_Workspace_][wks] uses [_GulpJS_][gulp] to run all the compiling logic and under
the hood it uses [Webpack][wpak] and [LessCss][less] to compile and bundle Javascript and CSS.

### `gulp build`

It compiles your application one single time, the outcome should be found in `build/dev`.

### `gulp dev`

It build the application and then monitor source files for changes, a new build is done
as soon you modify a source file.

### `gulp show`

It build the application, it launch the development server and it also open your default
browser in order to display the app.

### `gulp start`

**experimental** - this command wraps the `gulp dev` and `gulp show` in one single terminal session.

You can focus on you code and the build process and development server run in background.

If you want also to run tests in a `gulp tdd` way you can use the param `-t`:

    gulp start -t


## Html Entry Points

HTML entry points are just normal HTML files, you can create as many as you want 
and you can even create a sub-folders structure.

## Assets

Place static files like images, fonts, js or css libraries (also LessCss) under
`/app/assets/`, those files are just copied into the runnable version of you app.

When you link static files from your HTML entry points you can use the shortcut
`!/` to refer to the assets folder:

    <link rel="stylesheet" href="!/css/bootstrap.css">
    <script src="!/js/jquery.js"></link>

## Application Entry Points

You web application is build with some (optional) Javascript and LessCss entry points.

You can place those entry points in `/app/core/`, the compiler will take care of them
and it will generate the relative bundle.

> Each HTML entry point try to load the associated Js and Less entry point by name.  
> `foo.html` will look for `core/foo.js` and `core/foo.less`
>
> If the associated entry point does not exists the fallback are always
> `core/index.js` and `core/index.less` which are the main entry points.

In your Javascript entry points you can use `require('module-name')` to load
_Application Modules_ from `/node_modules/` and `/app/modules/`.

## Application Modules

You can split you application in modules which implement one single part of the app,
**one single responsibility**.

Each module is just a sub-folder of `/app/modules/` which implements the standard
_NodeJS_ modules rules.

### Big App Organization

When dealing with big applications I like to divide my modules by argument.

I use **domain modules** which are responsible for data and business rules,
**application modules** which are responsible of UI and user interaction,
**Knockout components modules** which are just standalone pieces of UI and normally
I also add an **utility modules** folder where I place modules which are just 
project's utilities but which are not so generic to be publisched.

My `/app/modules/` folder structure is like that:

    /app/modules
      /application
        /my-module-name
          index.js
        ...
      /domain
        /my-module-name
        ...
      /components
        /my-module-name
        ...
      /utils
        /my-module-name
        ...

To achieve this structure you need to modify `workspace.conf.js` adding a `sub-modules`
key in which you list the sub-modules folder structure you need:

    source: {...},
    target: {...},
    subModules: [
      'application',
      'domain',
      'components',
      'utils'
    ],
    ...

## Unit Tests & TDD

> **KarmaJS test suite is not installed by default!**

    // install KarmaJS test suite
    
    gulp init-tdd
    


Every app's module can host a `module-name/specs` folder in which to put one or more
**unit tests** specification files.

    /module-name
        index.js
        foo.js
        /specs
          test1.spec.js
          foo.spec.js
          
Tests are run with KarmaJS and MochaJS, ChaiJS and SinonJS are available to tests code.

    /**
     * Demo Unit Test
     */
    
    var moduleToTest = require('module-to-test');
    
    describe('module-to-test', function() {
    
        it('should do the math', function() {
            var result = moduleToTest.sum(1, 3);
            expect(result).to.equal(4);
        });
        
    });

### `gulp test`

run unit tests one single time.

### `gulp tdd`

run unit tests every time a source file or a test file change.


[wks]: https://github.com/PoliteJS/workspace "Single Page Application Workspace"
[npm]: npmjs.org
[node]: nodejs.org
[gulp]: gulpjs.com
[wpak]: http://webpack.github.io/
[less]: lesscss.org