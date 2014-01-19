var fs = require('fs');
var Ignore = require("fstream-ignore");
var Aws = require("aws-sdk");
var Semver = require("semver");
var fstream = require("fstream");
var tar = require("tar");
var zlib = require("zlib");
var Q = require("Q");
Q.longStackSupport = true;
var colors = require('colors');
var Parse = require('parse').Parse;
var mime = require('mime')
var Path = require('path');

//TODO: Must request this variables in a Safe Way

// *****************
// CLI
// *****************
var _3pm;

_3pm = (function(){

  var appName = "";
  var username = "";
  var packageInfo = "";
  var originalPackageInfo = "";
  var versionId = "";
  var appPackage;
  var stages = []

  function _3pm(applicationName) {
    appName = applicationName;
  }

  // Upload App Flow
  _3pm.prototype.downloadApp = function( ){

    Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );
    Aws.config.update( { accessKeyId: 'AKIAIHNBUFKPBA2LINFQ', secretAccessKey: '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' } );
    
    this.checkProfile()
    .then( this.validateProfile )
    .then( this.checkPackage )
    .then( this.validatePackage )
    .then( this.downloadPackage )
    .fail( function(error){ 
      console.error("Error Building + Uploading Package and/or App".red)
      console.error(error);
      console.error("The last line contains Error Info".red.bold)
      Q.fcall( this.undoUploadPackage )
      .then( this.undoUpdatePackageInfo )
      .then( function() {
        console.info("Recovered from Error correctly, please review info and try again. Let us know if you need any help.".green)
      })
      .fail(function(error){ 
        console.error(error);
        console.error("We could not undo the error, please notify Customer Support");
      });
    })
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Users the Key in 3vot.json to get the username from the 3VOT Platform
  _3pm.prototype.checkProfile= function(){
    var config = require(Path.join( process.env.PWD, "3vot.json") );
    var deferred = Q.defer();
    var Profiles = Parse.Object.extend("Profiles");
    var profileQuery = new Parse.Query(Profiles);
    profileQuery.equalTo("public_dev_key", config.key);
    console.info("Looking for Profile for key: xxxxxxxxxx located in 3vot.json".grey);
    stages.push["checkProfile"];
    return profileQuery.find();
  }

  //
  // Parms: Results from Query
  // Returns: Promise
  // Desc: Checks to see if the Key is valid, by listing the Profile associated with it.
  _3pm.prototype.validateProfile= function(results){
    if(results.length === 0){
      return Q.fcall(function () {
        return new Error("We could not find a profile with the provided key. Check Configuration in 3vot.json");
      });
    } 
    stages.push["validateProfile"]  
    console.info("Profile Validated");
    return results[0]; 
  }

  //
  // Parms: Profile from ValidateProfile
  // Returns: Promise
  // Desc: Requests the Package Master Object from 3VOT Platform
  _3pm.prototype.checkPackage= function(profile){
    username = profile.attributes.username
    var Packages = Parse.Object.extend("Packages");
    var packageQuery = new Parse.Query(Packages);
    packageQuery.equalTo("username", username);
    packageQuery.equalTo("name", appName);
    console.info("Validating Package Information".grey);
    stages.push["checkPackage"]  
    return packageQuery.find();
  }

  //
  // Parms: Package Results
  // Returns: Promise
  // Desc: Checks that the Package to be uploaded is valid and it's version number is incremental.
  _3pm.prototype.validatePackage= function(results){
    if(results.length == 0) return Q.fcall(function () {
         throw new Error("Package Version should be greater than " + packageInfo.attributes.version);
     });
    packageInfo = results[0]
    return packageInfo
    
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Uploads the Package tar.gz file to 3VOT Distibuted File Server
  _3pm.prototype.downloadPackage= function (packageInfo){
    console.info("Downloading Package to 3VOT App Store".yellow)
    var deferred = Q.defer();
    var s3 = new Aws.S3();
    
    var params = {Bucket: 'source.3vot.com', Key: username + '/' + appName  + "_" +  packageInfo.attributes.version  + '.3vot' };
    
    s3.getObject(params).createReadStream().pipe(zlib.createGunzip() ).pipe( tar.Extract( Path.join( process.cwd(), 'apps'  ) ) );
    
    return deferred.promise;
  }


  



  return _3pm;
})();

module.exports = _3pm;