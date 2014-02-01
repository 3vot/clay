var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
Q.longStackSupport = true;
var prompt = require("prompt")

var AwsCredentials = require("./aws/credentials");

var Profile = require("./model/profile")
var Package = require("./model/package")

Setup = (function() {

  Setup.prompt = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'key', description: 'Developer Key: ( Your Developer Key provided by the 3VOT Admin )' } ], function (err, result) {
      var setupController = new Setup(result);
      setupController.setup( result );
    });
  }

  var key = "";
  var profile = {};

  function Setup( attr ) {
    key= attr.key;
  }
  
  Setup.prototype.setup = function(){
    var deferred = Q.defer();

    this.getProfile()
    .then( AwsCredentials.requestKeysFromProfile )
    .then( this.scaffold )
    .then( this.installNPM )
    .then (function(){ return deferred.resolve() })
    .fail( function(err){ return deferred.reject(err) } );
    
    return deferred.promise;

  }

  Setup.prototype.getProfile= function(){
    var deferred = Q.defer();
    Profile.findByAttributes( { "public_dev_key": key } )
    .then( function(results){
      if(results.length == 0){ return deferred.reject("We could not find a profile with the provided key. Check Configuration in 3vot.json")  }
      profile = results[0];
      return deferred.resolve( results[0] );
    })
    .fail( function(err){ deferred.reject(err) } )
    
    return deferred.promise;
  }

  Setup.prototype.scaffold = function (){
    var deferred = Q.defer();

    console.log("Scaffolding Projects");
    
    var options = {
      key: profile.get("public_dev_key"),
      profile: profile.get("username"),
      folder: "3vot_" + profile.get("username")
    }

    fs.mkdirSync( Path.join( process.cwd(), options.folder ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "apps" ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "apps", "dependencies" ));
    fs.mkdirSync( Path.join( process.cwd(), options.folder , "tmp" )) ;

    var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../templates');
  
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

  Setup.prototype.installNPM= function(options){
     var deferred = Q.defer();
     
     var projectPath = Path.join( process.cwd() , options.folder );
     
     console.info(("Changing current directory to " + projectPath).yellow)
     
     process.chdir( projectPath );

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
      
      return deferred.promise;
      
  }
  
  return Setup;

})();

module.exports = Setup;