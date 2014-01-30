var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")
Q.longStackSupport = true;
var prompt = require("prompt")

var _3profile = require("./3profile")


_3app = (function() {

  function _3app() {}

  _3app.promptCreate = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'app', description: 'App Name ( The name of the app you want to create )' } ], function (err, result) {
      _3app.createApp( { appName: result.app } );
    });
  }
  
  _3app.createApp = function(options){
    var deferred = Q.defer();
    var pckPath = Path.join(process.cwd(), "package.json" );
    var config = require( pckPath );
    var _this = this;

    _this.appName = options.appName;
    
    _3profile.getProfileFromKey( config.key )
    .then( function( foundProfile ){  _this.profile = foundProfile; return _3app.checkPackage(_this.profile, _this.appName ); } )
    .then( _3app.validatePackage )
    .then( function(){ _3app.scaffold( _this.profile, _this.appName ) } )
    .then( function(){ return deferred.resolve() })
    .fail( function(err){ console.error(err); return deferred.reject(err); } );
    
    return deferred.promise;

  }

  //
  // Parms: Profile from ValidateProfile
  // Returns: Promise
  // Desc: Requests the Package Master Object from 3VOT Platform
  _3app.checkPackage= function( profile, appName ){    
    var Packages = Parse.Object.extend("Packages");
    var packageQuery = new Parse.Query(Packages);
    packageQuery.equalTo("username", profile.attributes.username);
    packageQuery.equalTo("name", appName);
    console.info("Validating Package Information".grey);
    return packageQuery.find();
  }

  //
  // Parms: Package Results
  // Returns: Promise
  // Desc: Checks that the Package to be uploaded is valid and it's version number is incremental.
  _3app.validatePackage= function(results){
    if(results.length > 0) return Q.fcall(function () {
         throw new Error( "The App " + app.name + " already exists. Please choose another name ");
     });

    return true;
  }

  _3app.scaffold = function ( profile, appName ){
    console.info("Scaffolding New App".grey);

    var deferred = Q.defer();

    var options = {
      key: profile.attributes.public_dev_key,
      profile: profile.attributes.username,
      folder: "3vot_" + profile.attributes.username
    }

    fs.mkdirSync( Path.join( process.cwd(), "apps", appName ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", appName , "app" ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", appName , "app", "assets" ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", appName , "code" ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", appName , "start" ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", appName , "templates" ));
    
    var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../templates');
  
    var codeSrc = fs.readFileSync(  Path.join( templatesPath, "app", "code.eco" ), "utf-8");
    var indexSrc = fs.readFileSync(  Path.join( templatesPath, "app", "index.eco" ), "utf-8");
    var layoutSrc = fs.readFileSync(  Path.join( templatesPath, "app", "layout.eco" ), "utf-8");
    var packageSrc = fs.readFileSync(  Path.join( templatesPath, "app", "package.eco" ), "utf-8");

    var codeRender = eco.render( codeSrc , { profile: profile, appName: appName });
    var indexRender = eco.render( indexSrc , { profile: profile, appName: appName });
    var layoutRender = eco.render( layoutSrc , { profile: profile, appName: appName });
    var pckRender = eco.render( packageSrc , { profile: profile, appName: appName });

    fs.writeFileSync( Path.join( process.cwd(), "apps", appName, "code" , "index.js" ), codeRender );
    fs.writeFileSync( Path.join( process.cwd(), "apps", appName, "start" , "index.js" ), indexRender );
    fs.writeFileSync( Path.join( process.cwd(), "apps", appName, "templates" , "layout.html" ), layoutRender );
    fs.writeFileSync( Path.join( process.cwd(), "apps", appName, "package.json" ), pckRender );

    return deferred.promise;

  }

  return _3app;

})();

module.exports = _3app;