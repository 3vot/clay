var fs = require("fs");
var Browserify = require("browserify");
var Q = require("q");
Q.longStackSupport = true;
var Path = require('path');
var Template = require("./template");
var _3vot = require("3vot");


module.exports = {

  buildHtml: function(pck){
    var deferred = Q.defer();
    
    var destPath = Path.join( process.cwd(), "apps", pck.name, "app","index.html" );
    var headProbablePath = Path.join( process.cwd(), "apps", pck.name, "templates","head.html" );
    
    var head = ""
    fs.readFile( headProbablePath, function(err, file){
      if(!err) head = file;

      var html = Template.html( JSON.stringify(pck), head );

      fs.writeFile( destPath, html, function(err){
        if(err) return deferred.reject(err);
        deferred.resolve(html);
      });
    });
    
    return deferred.promise;
  },

  bundleEntry: function(pck, entry){
    var deferred = Q.defer();
    var _this = this;
    var entryName = entry + ".js";
    var entryPath = Path.join( process.cwd(), "apps", pck.name, "start", entryName );
    var destPath = Path.join( process.cwd(), "apps", pck.name, "app" );
    
    var b = Browserify( entryPath , {
      extensions: pck.threevot.extensions
    });

    _ref = pck.threevot.transforms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      transform = _ref[_i];      
      b.transform(transform);
    }

    for (key in pck.threevot.external) {
      dep = pck.threevot.external[key];
      b.external(dep);
    }

    b.bundle( {}, 
      function(err, src) {
        if (err) return deferred.reject(err)
        _this.saveFile( destPath, entryName , src )
        .then( function(){ deferred.resolve( src ) }  )
        .fail( function(saveError){ deferred.reject(saveError)  }  )
      }
    );

    return deferred.promise;
  },

  //
  // Parms: Path: The BasePath as used by Browserify , AppName: The name of the App's Folder
  // Returns: Promise
  // Desc: Builds the App using Browserify using Transformations and excluding external dependencies.
  buildApp: function(appName){
    var app, b, dep, key, pck, transform, _i, _len, _ref, _ref1,
      _this = this;
  
    var deferred = Q.defer();
    
    var packagePath = Path.join( process.cwd(), "apps", appName, "package.json" );
    
    pck = require( packagePath ) 

    bundlePromises = []
    for( entry in pck.threevot.entries ){
      bundlePromises.push(this.bundleEntry(pck, entry));
    }
    
    Q.all( bundlePromises )
    .then( function(compiledEntries){ return _this.buildHtml(pck); })
    .then( function(html){ return deferred.resolve(html);  } )
    .fail( function(err){ return deferred.reject( err ) })  
      
    return deferred.promise;
  },

  // Parms: Path: The BasePath as used by Browserify , AppName: The name of the App's Folder
  // Returns: Promise
  // Desc: Builds the Dependencies identified in 
  buildDependency: function(appName){
    var deferred = Q.defer();
    var b = Browserify()
   
    var packagePath = Path.join(process.cwd(), "apps", appName, "package.json" );
    var appPath = Path.join( process.cwd(), "apps", appName);
    var destPath = Path.join( process.cwd(), "apps", "dependencies" );
   
    var pck = require( packagePath )
    var _ref = pck.threevot.external;
    var _this = this;

    for (key in _ref) {
      var dep = _ref[key];
      b.require( dep, { expose: dep, basedir: appPath } );
    }

    b.bundle( {}, 
      function(err, src) {
        if (err) return deferred.reject(err)
        _this.saveFile( destPath, _3vot.dependency.getDependencyName( pck ) + ".js", src )
        .then( function(){ deferred.resolve( src ) }  )
      }
    );

    return deferred.promise;
  },
  
  //
  // Params: Path: The File Path, Name: The File Name, Contents: The File Contents Buffer
  // Returns: Promise
  // Desc: Saves a File to System
  saveFile: function(path, filename, contents ){
    var deferred = Q.defer();
    console.log(("Saving File " + filename + " to " + path).yellow);
    fs.mkdir(path, function(){
      fs.writeFile(  Path.join(path, filename) , contents, 
        function(err){
          if(err) return deferred.reject(err);
          return deferred.resolve();
        }
      )
    });
    return deferred.promise;
  }
}