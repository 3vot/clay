var bower = require("bower");
var Path = require("path")
var fs = require("fs")
var Q = require("q");
Q.longStackSupport = true;

_3install = (function() {

  function _3install() {}

  _3install.install = function( appName, destinationDir ){
    var deferred = Q.defer();
        
    process.chdir( Path.join( process.cwd(), "apps", appName ) );
        
    //Destination DIR is always taken from the path where the node command is invoked
    
    var pkgPath = Path.join( process.cwd(), "package.json");

    var pkg = require( pkgPath )
    var gitDeps = Object.keys( pkg.threevot.gitDependencies )
  
    _3install.installBower(destinationDir, gitDeps)
    .then( _3install.installNPM  )
    
    .then( function() {
      deferred.resolve()
    })
    .fail( function(error) { 
      deferred.reject(error);
    });
    
    return deferred.promise;
    
  }

  _3install.installBower= function(destinationDir, packagesToInstall ){
    var deferred = Q.defer();
    
    console.log( ( "Installing Git Components in"  + destinationDir) .yellow)

    bower.config.directory = destinationDir

    bower.commands
    .install(packagesToInstall, {}, {} )
    .on('end', function (installed) {
        deferred.resolve();
    })

    .on("error", function (error) {
        console.log(error)
        deferred.reject(error);
    });

    return deferred.promise;

  }
  
  _3install.installNPM= function(){
    console.log("Installing NPM Components".yellow)

     var deferred = Q.defer();

     var npm = require("npm");

      npm.load(npm.config, function (er) {
        if (er) return deferred.reject(er);
        console.log("Current Path NPM INSTALL " + process.cwd());
        npm.commands.install(["."], function (er, data) {
          if (er) return deferred.reject(er)
          return deferred.resolve()
          // command succeeded, and data might have some info
        });
        npm.on("log", function (message) { console.log(message) })
      });
      
      return deferred.promise;
      
  }

  return _3install;

})();

module.exports = _3install;