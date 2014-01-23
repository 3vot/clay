var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
Q.longStackSupport = true;

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

_3setup = (function() {

  function _3setup() {}

  _3setup.setup = function(options){
    var deferred = Q.defer();

    _3setup.getInfo(options)
    .then( _3setup.validateProfile)
    .then( _3setup.scaffold )
    .then( _3setup.installNPM )
    .then (function(){ return deferred.resolve() })
    .fail( function(err){ console.error(err); return deferred.reject(err) } );
    
    return deferred.promise;

  }

  _3setup.getInfo = function(options){
    var deferred = Q.defer();
    var Profiles = Parse.Object.extend("Profiles");
    var profileQuery = new Parse.Query(Profiles);
    profileQuery.equalTo("public_dev_key", options.key);
    console.info("Looking for Profile for key: xxxxxxxxxx from provided options".grey);
    return profileQuery.find();
  }

  //
  // Parms: Results from Query
  // Returns: Promise
  // Desc: Checks to see if the Key is valid, by listing the Profile associated with it.
  _3setup.validateProfile= function(results){
    if(results.length === 0){
      return Q.fcall(function () {
        return new Error("We could not find a profile with the provided key. Check Configuration in 3vot.json");
      });
    } 
    console.info("Profile Validated");
    return results[0];
  }


  _3setup.scaffold = function (profile){

    var deferred = Q.defer();

    var options = {
      key: profile.attributes.public_dev_key,
      profile: profile.attributes.username,
      folder: "3vot_" + profile.attributes.username
    }

    fs.mkdir( Path.join( process.cwd(), options.folder ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "apps" ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "apps", "dependencies" ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "tmp" ), function(){}) ;

    var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../templates');
  
    var _3votJSON = require( Path.join(  templatesPath, "_3vot.json" ));
    var gitIgnore = fs.readFileSync(  Path.join( templatesPath, "_.gitignore" ), "utf-8");
    var pckJSON = require( Path.join( templatesPath, "package.json" ));

    _3votJSON.key = options.key;
    _3votJSON.profile = options.profile;

    fs.writeFileSync( Path.join(process.cwd(), options.folder, "3vot.json"), JSON.stringify(_3votJSON, null, '\t') );
    fs.writeFileSync( Path.join(process.cwd(), options.folder, "package.json"), JSON.stringify(pckJSON, null, '\t') );
    fs.writeFile( Path.join(process.cwd(), options.folder, ".gitignore"), gitIgnore, function(){ deferred.resolve( options )  } );

    return deferred.promise

  }


  _3setup.installNPM= function(options){
     var deferred = Q.defer();
     
     var projectPath = Path.join( process.cwd() , options.folder );
     
     console.info(("Changing current directory to " + projectPath).yellow)
     
     process.chdir( projectPath );

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
  
  return _3setup;

})();

module.exports = _3setup;