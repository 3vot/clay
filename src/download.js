require("coffee-script")

var fs = require('fs');
var Aws = require("aws-sdk");
var Semver = require("semver");
var fstream = require("fstream");
var tar = require("tar");
var zlib = require("zlib");
var Q = require("q");
var colors = require('colors');
var Parse = require('parse').Parse;
var mime = require('mime')
var Path = require('path');
var prompt = require("prompt")

var AwsCredentials = require("./aws/credentials");

var Install = require("./install")

var Profile = require("./model/profile")
var Package = require("./model/package")

//TODO: Must request this variables in a Safe Way

// *****************
// CLI
// *****************
var Download;

Download = (function(){

  var app = {};

  Download.prompt = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'username', description: 'Profile: ( The profile name of the owner of the app )' }, 
      { name: 'name', description: 'App: ( The App you want to Download )' },
      { name: 'code', description: "Code: ( The private code in case it's a private app )" }, 
      { name: 'version', description: 'Version: ( The App version, hit enter for latest )' } ], 

      function (err, result) {

        var download = new Download( result )
        download.downloadApp()
       .then( function(){ 
         var destinationDir = Path.join( "apps", result.name, "node_modules" );
         return Install.install(result.name, destinationDir) 
        })
        .fail( function(err){  console.error(err); } )  
     });
  }

  function Download( attr ) {
    app = { 
      username: attr.username,
      name: attr.name,
      version: attr.version,
      code: attr.code,
      profile: {},
      package: {}
    }
  }

  Download.prototype.downloadApp = function( options ){
    console.info("We will Download the App from 3VOT App Store".yellow)
    
    var deferred = Q.defer();

    this.getProfile()
    .then( AwsCredentials.requestKeysFromProfile )
    .then( this.getPackage)
    .then( this.downloadPackage )
    .then( this.adjustPackage )
    .then( deferred.resolve )
    .fail( function(err){ return deferred.reject(err); })

    return deferred.promise;
  }




  Download.prototype.getProfile= function(){
    var config = require(Path.join( process.cwd(), "3vot.json") );
    var deferred = Q.defer();
    Profile.findByAttributes( { "public_dev_key": config.key } )
    .then( function(results){
      if(results.length == 0){ return deferred.reject("We could not find a profile with the provided key. Check Configuration in 3vot.json")  }
      app.profile = results[0];
      deferred.resolve( results[0] );
    })
    .fail( function(err){ deferred.reject(err) } )
    
    return deferred.promise;
  }

  Download.prototype.getPackage= function(){
    var config = require(Path.join( process.cwd(), "3vot.json") );
    var deferred = Q.defer();
    Package.findByAttributes( { "username": app.username, "name": app.name  } )
    .then( checkPackage )
    .fail( deferred.reject )

    function checkPackage(results){
      //Test Existance of Package
      if(results.length == 0) return deferred.reject("We could not find the package " + app.name + " from " + app.username );
      app.package = results[0]
      //Test Private and Code of App, in case it's private
      if( app.package.get("private") && app.package.get("privateCode") != app.code) return deferred.reject("App is private and provided code is incorrect. A private code is provided by the Private App Owner, that allows you to clone private apps");
      deferred.resolve( results[0] );
    }
    
    return deferred.promise;

  }

  //
  Download.prototype.downloadPackage= function (){
    console.info("Downloading Package to 3VOT App Store".yellow)
    var deferred = Q.defer();
    var s3 = new Aws.S3();
    
    var version = app.version || app.package.attributes.version;
    var params = {Bucket: 'source.3vot.com', Key: app.username + '/' + app.name  + "_" +  version + '.3vot' };
    s3.getObject(params).createReadStream().pipe(zlib.createGunzip() ).pipe( tar.Extract( Path.join( process.cwd(), 'apps' ) ) )
    .on("end", function(){ deferred.resolve(); })
    .on("error", function( error ){ deferred.reject(error) });
    
    return deferred.promise;
  }


  Download.prototype.adjustPackage = function(){
    
    var deferred = Q.defer();
    console.info("Adjusting the package.json for your Profile".yellow)
    var pck = require( Path.join( process.cwd(), "apps", app.name, "package.json" )  );
    var vot = require( Path.join( process.cwd(), "3vot.json" )  )
    pck.profile = vot.profile;
    pck.version = "0.0.1"

    fs.writeFile( Path.join( process.cwd(), "apps", app.name, "package.json" ), JSON.stringify(pck,null,'\t') , function(err){
      if(err) return deferred.reject(err);
      deferred.resolve()
    });

    return deferred.promise;

  }

  return Download;
})();

module.exports = Download;