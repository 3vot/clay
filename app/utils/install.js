var bower = require("bower");
var Path = require("path")
var fs = require("fs")
var prompt = require("prompt")

var Q = require("q");

function install( appName, destinationDir ){
  var deferred = Q.defer();
      
  console.log("Changing CWD to App Folder")
  process.chdir( Path.join( process.cwd(), "apps", appName ) );
      
  //Destination DIR is always taken from the path where the node command is invoked
  
  var pkgPath = Path.join( process.cwd(), "package.json");

  var pkg = require( pkgPath )
  var gitDeps = Object.keys( pkg.threevot.gitDependencies )

  installBower(destinationDir, gitDeps)
  .then( installNPM  )
  
  .then( function() {
    console.log("Changing CWD to Project Folder")
    process.chdir( Path.join( process.cwd(), "..", ".." ) );
    deferred.resolve();
  })
  .fail( function(error) { 
    deferred.reject(error);
  });
  
  return deferred.promise;
  
}

function installBower(destinationDir, packagesToInstall ){
  var deferred = Q.defer();
  
  console.log( ( "Installing Git Components in "  + destinationDir) .yellow)

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
  
function installNPM(){
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


module.exports = install;