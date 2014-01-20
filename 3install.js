var bower = require("bower");
var Path = require("path")
var fs = require("fs")
var Q = require("Q");
Q.longStackSupport = true;

_3install = (function() {

  function _3install() {}

  _3install.install = function(appName){
    var deferred = Q.defer();
  
    process.chdir( process.cwd() + '/apps/' + appName);

    var appPath = "./apps/" + appName + "/node_modules"
    var pkgPath = Path.join(process.cwd(), "package.json");

    var pkg = require( pkgPath  )
    var gitDeps = Object.keys( pkg.threevot.gitDependencies )
  
    _3install.installBower(appPath, gitDeps)
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
     var deferred = Q.defer();
     
     var npm = require("npm");

      npm.load(npm.config, function (er) {
        if (er) return handlError(er);
        npm.commands.install(["."], function (er, data) {
          if (er) return deferred.reject(er)
          return deferred.resolve()
          // command succeeded, and data might have some info
        });
        npm.on("log", function (message) { })
      });
      
      return deferred.promise;
      
  }
  
  
  return _3install;

})();

module.exports = _3install;