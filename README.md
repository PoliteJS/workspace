PoliteJS's Single Page App Workspace
====================================

    1. Install Dependencies
    > npm install
    
    2. Build
    > grunt
    
    3. Run Debug Server
    > node server.js
    
> This is a very early release which works but lack in documentation.  
> Please **[refer to the GitHub repository](https://github.com/PoliteJS/workspace)** 
> for the latest readme and docs!


## Workspace

_Workspace_ is basically a _GruntJS_ setup which combine some existing tools to provide you
with **a good project organization and code structure in order to improve productivity**.

> _Workspace_ take **heavy inspiration** from a framework used internally in
> Mobenga AB, the company I work with. This project try to bring some good concept we use 
> to the OpenSource world!  
> **I really want to credit Mobenga AB and my colleagues Markus, Robert and Tomas!**



### Features

### Modules

### node_modules



## Export SubModules

By default _Workspace_ makes available each folder under `src/features` and `src/modules` as a 
_require_ module so you can run:

    require('module-name').exportedAPI
    
You can also expose some sub-modules in order to run:

    require('module-name/sub-module').exportedAPI
    
You should achieve this objective by editing a `package.json` file inside the module:

    // module-name/package.json
    {
      "exports" : [
        "sub-module",
        "sub-module/sub-sub",
      ]
    }
    
> **NOTE:** you use the `"exports" : true` shortcut to expose all sub-modules!

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
