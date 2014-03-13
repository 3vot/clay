var Path = require("path")
var fs = require("fs")
var Q = require("q");


var Profile = require("../models/profile")


var AwsCredentials = require("../aws/credentials");


var profile = {};

var promptOptions = {
  public_dev_key: null
}

var tempVars = {
  profile: null
}

function execute(options){
    var deferred = Q.defer();
    promptOptions = options;
    
    getProfile()
    .then( scaffold )
    .then( installNPM )
    .then (function(){ return deferred.resolve() })
    .fail( function(err){ return deferred.reject(err) } );
    return deferred.promise;
  }

function getProfile(){
  var deferred = Q.defer();
  
  
  callbacks = {
    done: function(profile){
      tempVars.profile = profile
      return deferred.resolve(profile);
    },
    fail: function(err){
      return deferred.reject(err);
    }
  }
  Profile.callView( "authenticate", { public_dev_key: promptOptions.public_dev_key }, callbacks )
  
  return deferred.promise;
  
}

function scaffold(){
    console.log("Scaffolding Projects");
    var deferred = Q.defer();
    
    var options = {
      public_dev_key: tempVars.profile.security.public_dev_key,
      user_name: tempVars.profile.user_name,
      folder: "3vot_" + tempVars.profile.user_name
    }


    fs.mkdirSync( Path.join( process.cwd(), options.folder ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "apps" ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "apps", "dependencies" ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "tmp" )) ;

    var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../../templates');
    var _3votJSON = require( Path.join(  templatesPath, "_3vot.json" ));
    var gitIgnore = fs.readFileSync(  Path.join( templatesPath, "_.gitignore" ), "utf-8");
    var pckJSON = require( Path.join( templatesPath, "package.json" ));

    _3votJSON.public_dev_key = tempVars.profile.security.public_dev_key;
    _3votJSON.user_name = tempVars.profile.user_name;

    fs.writeFileSync( Path.join(process.cwd(), options.folder, "3vot.json"), JSON.stringify(_3votJSON, null, '\t') );
    fs.writeFileSync( Path.join(process.cwd(), options.folder, "package.json"), JSON.stringify(pckJSON, null, '\t') );
    fs.writeFile( Path.join(process.cwd(), options.folder, ".gitignore"), gitIgnore, function(){ deferred.resolve( options )  } );

    return deferred.promise;
  }

function installNPM(options){
  var deferred = Q.defer();
  var projectPath = Path.join( process.cwd() , options.folder );
  console.info("Changing current directory in Profile Setup to " + projectPath)
  process.chdir( projectPath );

  try{
   var npm = require("npm");

    npm.load(npm.config, function (er) {
      if (er) return deferred.reject(er);
      npm.commands.install(["."], function (er, data) {
        if (er) return deferred.reject(er)
        restoreCWD()
        return deferred.resolve()
        // command succeeded, and data might have some info
      });
      npm.on("log", function (message) { })
    });
  }
  catch(e){
    console.log("*** WARNING: ***")
    console.log("PLEASE INSTALL NPM MANUALLY by running npm install");
    restoreCWD()
    return deferred.resolve()
  }

  return deferred.promise;      
  }

function restoreCWD(){
  var projectPath = Path.join( process.cwd() , ".." );
  console.info("Restoring current directory in Profile Setup")
  process.chdir( projectPath );
}

module.exports = execute;