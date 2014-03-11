var Path = require("path")
var fs = require("fs")
var Q = require("q");


var Profile = require("../models/profile")


var AwsCredentials = require("../aws/credentials");


var profile = {};

function execute(options){
    var deferred = Q.defer();
    Profile.queryProfile(options.key)
    .then( function(srcProfile){ profile = srcProfile; return srcProfile; })
    .then( scaffold )
    .then( installNPM )
    .then (function(){ return deferred.resolve() })
    .fail( function(err){ return deferred.reject(err) } );
    return deferred.promise;
  }

function scaffold(){
    console.log("Scaffolding Projects");
    var deferred = Q.defer();
    
    var options = {
      public_dev_key: profile.security.public_dev_key,
      user_name: profile.user_name,
      folder: "3vot_" + profile.get("user_name")
    }

    fs.mkdirSync( Path.join( process.cwd(), options.folder ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "apps" ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "apps", "dependencies" ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "tmp" )) ;

    var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../../templates');
    var _3votJSON = require( Path.join(  templatesPath, "_3vot.json" ));
    var gitIgnore = fs.readFileSync(  Path.join( templatesPath, "_.gitignore" ), "utf-8");
    var pckJSON = require( Path.join( templatesPath, "package.json" ));

    _3votJSON.key = options.key;
    _3votJSON.profile = options.profile;

    fs.writeFileSync( Path.join(process.cwd(), options.folder, "3vot.json"), JSON.stringify(_3votJSON, null, '\t') );
    fs.writeFileSync( Path.join(process.cwd(), options.folder, "package.json"), JSON.stringify(pckJSON, null, '\t') );
    fs.writeFile( Path.join(process.cwd(), options.folder, ".gitignore"), gitIgnore, function(){ deferred.resolve( options )  } );

    return deferred.promise;
  }

function installNPM(options){
  var deferred = Q.defer();
  var projectPath = Path.join( process.cwd() , options.folder );

  console.info("Changing current directory to " + projectPath)

  process.chdir( projectPath );

  try{
   var npm = require("npm");

    npm.load(npm.config, function (er) {
      if (er) return deferred.reject(er);
      npm.commands.install(["."], function (er, data) {
        if (er) return deferred.reject(er)
        return deferred.resolve()
        // command succeeded, and data might have some info
      });
      npm.on("log", function (message) { })
    });
  }
  catch(e){
    console.log("*** WARNING: ***")
    console.log("PLEASE INSTALL NPM MANUALLY by running npm install");
    return deferred.resolve()
  }

  return deferred.promise;      
  }

module.exports = execute;