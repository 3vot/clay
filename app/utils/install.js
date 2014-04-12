var bower = require("bower");
var Path = require("path")
var fs = require("fs")
var prompt = require("prompt")
var Log = require("./log")

var Q = require("q");

function install( appName, destinationDir ){
  var deferred = Q.defer();
  var app_path = Path.join( process.cwd(), "apps", appName )
  process.chdir( app_path  );
      
  //Destination DIR is always taken from the path where the node command is invoked
  
  var pkgPath = Path.join( process.cwd(), "package.json");

  var pkg = require( pkgPath )
  var gitDeps = Object.keys( pkg.threevot.gitDependencies )

  installBower(destinationDir, gitDeps)
  .then( installNPM  )
  .then( function() {
    process.chdir( Path.join( process.cwd(), "..", ".." ) );
    return deferred.resolve();
  })
  .fail( function(error) { 
    return deferred.reject(error);
  });
  
  return deferred.promise;
  
}

function installBower(destinationDir, packagesToInstall ){
  var deferred = Q.defer();

  Log.debug("Installing Git Components in "  + destinationDir, "utils/install", 42)
  
  bower.config.directory = destinationDir

  bower.commands
  .install(packagesToInstall, {}, {} )
  .on('end', function (installed) {
      deferred.resolve();
  })

  .on("error", function (error) {
      Log.debug("error in install bower", "utils/install", 51)    
      deferred.reject(error);
  });

  return deferred.promise;
}
  
function installNPM(){
  var deferred = Q.defer();

  Log.debug("Installing NPM Components in " + process.cwd(), "utils/install",60)
  var exec = require('child_process').exec;

  var npmcommand = (process.platform === "win32" ? "npm.cmd" : "npm")
  
  var spawn = require('child_process').spawn,
      npm    = spawn(npmcommand, ['install', '.']);

  npm.stdout.on('data', function (data) {
    Log.debug(data, "utils/install", 66);
  });

  npm.on('close', function (code) {
    return deferred.resolve()
  });

/*
  child = exec('npm install .' , function(err, stdout, stderr){
    if(err) return deferred.reject(err)
    Log.debug("NPM install complete", "utils/install", 65);
    Log.debug2(stderr)
    process.nextTick(function(){
      return deferred.resolve();   
    })
  })
*/  
  
  return deferred.promise;  
}
  
function installNPM2(){
  Log.debug("Installing NPM Components in " + process.cwd(), "utils/install",60)

   var deferred = Q.defer();

   var npm = require("npm");

    npm.load(npm.config, function (er) {
      if (er){
        Log.debug("error in load npm", "utils/install", 68)    
        return deferred.reject(er);
      }
      npm.commands.install(["."], function (er, data) {
        if (er){
          Log.debug("error in install npm", "utils/install", 73)    
          return deferred.reject(er)
        }
        return deferred.resolve()
        // command succeeded, and data might have some info
      });
      npm.on("log", function (message) { Log.debug(message, "utils/install",74) })
    });
    
    return deferred.promise;
    
}


module.exports = install;

install.installNPM = installNPM;