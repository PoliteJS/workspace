PoliteJS Workspace - <small>Gulp Edition</small>
=================================

PoliteJS [_Workspace_][wks] is a [_GulpJS_][gulp] setup which combines some of the best 
**Open Source** modules to provide you with a clever project organization and 
code structure in order to **increase web development productivity**.

> In order to run the follwing Quick Start scripts you need 
> [NodeJS][node] and [NPM][npm] up and running on your computer.
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

It build the application, it launch the **development server** and it also open your default
browser in order to display the app.

### `gulp start`

**experimental** - this command wraps the `gulp dev` and `gulp show` in one single terminal session.

You can focus on you code and the build process and development server run in background.

If you want also to run tests in a `gulp tdd` way you can use the param `-t`:

    gulp start -t


## Html Entry Points

HTML entry points are just normal HTML files, you can create as many as you want 
and you can even create a sub-folders structure.

You can embed _Markdown_ regions within the HTML that are parsed to HTML at building time:

    <!-- Markdown -->
    this will be **converted to HTML** during the building!
    <!-- /Markdown -->
    

## Assets

Place static files like images, fonts, js or css libraries (also LessCss) under
`/app/assets/`, those files are just copied into the runnable version of you app.

When you link static files from your HTML entry points you can use the shortcut
`!/` to refer to the assets folder:

    <link rel="stylesheet" href="!/css/bootstrap.css">
    <script src="!/js/jquery.js"></link>

## Application Entry Points

You web application is build with some (optional) Javascript and LessCss entry points.

You can place those entry points in `/app/`, the compiler will take care of them
and it will generate the relative bundle.

> Each HTML entry point try to load the associated Js and Less entry point by name.  
> `foo.html` will look for `core/foo.js` and `core/foo.less`
>
> If the associated entry point does not exists the fallback are always
> `core/index.js` and `core/index.less` which are the main entry points.

In your Javascript entry points you can use `require('module-name')` to load
_Application Modules_ from `/node_modules/` and `/app/modules/`.

## Application Features

You can organize a big WebApp in small pieces which implements one single part of the app,
**one single responsibility**.

Each feature is just a sub-folder of `/app/features/` which implements the standard
_NodeJS_ modules rules.

From your Javascript entry point you can `require('xxx')` to load `/app/features/xxx/index.js`.

You can host HTML files within a feature folder and require them usin the name with the extension:

    require('./template.html');
    
The HTML file is loaded as a string template, it can also contain some _Markdown_ partial which is compiled to HTML during the require.

### Big App Organization

When dealing with big applications I like to divide my features by argument.

I use **domain features** which are responsible for data and business rules,
**application features** which are responsible of UI and user interaction,
**Knockout components** which are just standalone pieces of UI and normally
I also add an **utility features** folder where I place modules which are just 
project's utilities but which are not so generic to be publisched.

My `/app/features/` folder structure is like that:

    /app/features
      /application
        /my-features-name
          index.js
        ...
      /domain
        /my-features-name
        ...
      /components
        /my-features-name
        ...
      /utils
        /my-features-name
        ...

To achieve this structure you need to modify `workspace.conf.js` adding a `sub-modules`
key in which you list the sub-modules folder structure you need:

    source: {
      features: [
        'application',
        'domain',
        'components',
        'utils'
      ]
    },

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

## Sourcemaps & Minification

_Workspace_ produces sourcemaps by default and does not minify your code to serve the best processing performances.

You can control those behaviours from `workspace.conf.js`:

    target: {
      dev: {
        css: {
          sourcemaps: true // false,
          minify: true // false
        },
        js: {
          sourcemaps: true // false,
          minify: true // false
        }
      }
    }

## HTML Import

Your HTML entry points supports a strategy to include some ohter HTML resources from
around the application repository:

	<link rel="import-html" href="./path/to/file.html" params="foo:1, faa:2" />
	
The target HTML file will be imported into the original page at build time.

The `params` attribute is converted into a plain Javascript object and it is given to the
JSSP interpreter. It will be available as `this.params.xxx`.

## JSSP (Javascript Server Pages)

All the HTML entry points and the imported HTML snippets are capable to run Javascript at building time (which is executed by NodeJS, not the browser!).

	// app/index.html
	<%
	var title = 'My title';
	%>
	<head>
		<title><%= title %></title>
	</head>
	
Each file is executed into a closure so you can define local variables.



[wks]: https://github.com/PoliteJS/workspace "Single Page Application Workspace"
[npm]: npmjs.org
[node]: nodejs.org
[gulp]: gulpjs.com
[wpak]: http://webpack.github.io/
[less]: lesscss.org