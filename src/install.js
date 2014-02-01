var bower = require("bower");
var Path = require("path")
var fs = require("fs")
var prompt = require("prompt")

var Q = require("q");
Q.longStackSupport = true;

Install = (function() {

  function Install() {}

  Install.prompt = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'name', description: 'App: ( the name of the app you want its dependencies to be Installed  )' } ], function (err, result) {
      var destinationDir = Path.join( "apps", result.name, "node_modules" );
      Install.install(result.name, destinationDir)
      .then( function(){ console.info("Installation Complete".green)  } )
      .fail( function(err){ console.error(err); }  )   
    });
  }

  Install.install = function( appName, destinationDir ){
    var deferred = Q.defer();
        
    process.chdir( Path.join( process.cwd(), "apps", appName ) );
        
    //Destination DIR is always taken from the path where the node command is invoked
    
    var pkgPath = Path.join( process.cwd(), "package.json");

    var pkg = require( pkgPath )
    var gitDeps = Object.keys( pkg.threevot.gitDependencies )
  
    Install.installBower(destinationDir, gitDeps)
    .then( Install.installNPM  )
    
    .then( function() {
      deferred.resolve()
    })
    .fail( function(error) { 
      deferred.reject(error);
    });
    
    return deferred.promise;
    
  }

  Install.installBower= function(destinationDir, packagesToInstall ){
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
  
  Install.installNPM= function(){
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

  return Install;

})();

module.exports = Install;