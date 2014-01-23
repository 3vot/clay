var fs = require('fs');
var Ignore = require("fstream-ignore");
var Aws = require("aws-sdk");
var Semver = require("semver");
var fstream = require("fstream");
var tar = require("tar");
var zlib = require("zlib");
var Q = require("q");
Q.longStackSupport = true;
var colors = require('colors');
var Parse = require('parse').Parse;
var mime = require('mime')
var Path = require('path');

//TODO: Must request this variables in a Safe Way

// *****************
// CLI
// *****************
var _3upload;

_3upload = (function(){

  var appName = "";
  var username = "";
  var packageInfo = "";
  var originalPackageInfo = "";
  var versionId = "";
  var appPackage;
  var stages = []

  function _3upload(applicationName) {
    appName = applicationName;
  }

  // Upload App Flow
  _3upload.prototype.uploadApp = function( ){

    appPackage = require( Path.join( process.cwd(), "apps", appName, "package.json" ))

    Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );
    Aws.config.update( { accessKeyId: 'AKIAIHNBUFKPBA2LINFQ', secretAccessKey: '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' } );
    
    this.buildPackage(appName)
    .then( this.checkProfile )
    .then( this.validateProfile )
    .then( this.checkPackage )
    .then( this.validatePackage )
    .then( this.uploadPackage )
    .then( this.uploadAssets )
    .then( this.updatePackageInfo )
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

  // **************
  // OOT Functions
  // ( do only one thing  )  
  // **************

  //Builds a Package ( tar.gz ) from a folder
  // Parms: appName : The Name of the App/Folder inside the "apps" folder
  // Returns: Promise
  // Desc: Simply packs all files in the folder in a tar.gz
  _3upload.prototype.buildPackage = function(appName){
    console.info(("Building App " + appName).green)
    var deferred = Q.defer();
    var appPackage = require( Path.join( process.cwd(), "apps", appName, "package.json" ) )
    var stream = Ignore( { path: 'apps/' + appName, type: "Directory", ignoreFiles: [ ".gitignore" ] }).pipe(tar.Pack()).pipe(zlib.createGzip());
    stream.pipe( fstream.Writer( Path.join( process.cwd(), "tmp", appName + ".tar.gz") ) )

    stream.on("end", function(){
      var url = Path.join( process.cwd(), "tmp", appName + ".tar.gz")
      console.info(("Package Build at: " + url).grey)  
      stages.push["buildPackage"]  
      deferred.resolve(url);
    });

    stream.on("error", function(error){
      console.error(("Error in Build Package: " + error).grey);
      deferred.reject(new Error(error) );
    });

    return deferred.promise;
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Users the Key in 3vot.json to get the username from the 3VOT Platform
  _3upload.prototype.checkProfile= function(){
    var config = require(Path.join( process.cwd(), "3vot.json") );
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
  _3upload.prototype.validateProfile= function(results){
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
  _3upload.prototype.checkPackage= function(profile){
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
  _3upload.prototype.validatePackage= function(results){
    packageInfo = results[0]
    originalPackageInfo = results[0]
    if (packageInfo === undefined){
      var Packages = Parse.Object.extend("Packages");
      packageInfo = new Packages();
    }
    if ( packageInfo.attributes.version !== undefined && !Semver.gt( appPackage.version, packageInfo.attributes.version )){
      return Q.fcall(function () {
          throw new Error("Package Version should be greater than " + packageInfo.attributes.version);
      });
    }
    console.info("Package Validate Correctly".green)
    stages.push["validatePackage"]  
    return packageInfo;
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Uploads the Package tar.gz file to 3VOT Distibuted File Server
  _3upload.prototype.uploadPackage= function (){
    console.info("Uploading Package to 3VOT App Store".yellow)
    var deferred = Q.defer();
    fs.readFile( Path.join( process.cwd(), 'tmp', appName + '.tar.gz'), function (err, data) {
      if (err) return deferred.reject(err);
      var s3 = new Aws.S3();
      s3.putObject( { Body: data , Key: username + '/' + appName  + "_" +  appPackage.version  + '.3vot', Bucket: 'source.3vot.com' }, function(s3Error, data) {
        if (s3Error) return deferred.reject(s3Error);
        console.info("Package Uploaded Correctly to 3VOT App Store".green)
        this.versionId = data.versionId
        stages.push["uploadPackage"]  
        deferred.resolve(data)
      });
    });
    return deferred.promise;
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Used in case of an error in the transaction, to delete the file that was just saved.
  _3upload.prototype.undoUploadPackage= function(){
    if (stages.indexOf("uploadPackage") == -1){
      console.info("There is no need to undo Package Upload, never uploaded".yellow)
      return false;
    }
    var deferred = Q.defer();
    console.info("Undoing last Update to Package".yellow)
    var s3 = new Aws.S3();
    s3.deleteObject( { Key: username + '/' + appName  + "_" +  appPackage.version  + '.3vot', Bucket: 'source.3vot.com' }, function(s3Error, data) {
      if (s3Error) return deferred.reject(s3Error);
      console.info(data);
      console.info("Package Version Reverted in App Store".yellow)
      deferred.resolve(data)
      stages.push["undoUploadPackage"]
    });  
    return deferred.promise;
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Uploads the Application Assets to 3VOT Application Server
  _3upload.prototype.uploadAssets = function(){
    var deferred = Q.defer();
    var _this = this;

    var uploadFile= function(fileObject){
      var deferred = Q.defer();
      var s3 = new Aws.S3();
      var rawFile = fs.readFileSync(fileObject.path, "utf-8")
      var mimetype = mime.lookup(fileObject.path)

      s3.putObject( { CacheControl: "max-age=31536000", ContentType: mimetype , ACL: 'public-read', Body: rawFile, Key: fileObject.key , Bucket: 'demo.3vot.com' }, function(err, data) {
        if (err) { console.log(err); return deferred.reject(err); }
        console.info( ( "File Uploaded Correctly: " + fileObject.path + " to " + fileObject.key ).green );
        deferred.resolve();
      });

      return deferred.promise;
    }

    var walkDir = function(dir) {
      var results = [];
      var list = fs.readdirSync(dir);
      list.forEach(function(sourceFile) {
        file = Path.join( dir, sourceFile );
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()){ console.log("Avoiding directory" + file);  }
        else{ results.push({path: file, name: sourceFile }); }
        
      })
      return results;
    }

    uploadPromises = []
    var assets = walkDir( Path.join( process.cwd(), "apps", appName, "app",  "assets" ) );
    var apps = walkDir( Path.join( process.cwd(), "apps", appName, "app" ) );
    var deps = walkDir( Path.join( process.cwd(), "apps", "dependencies" ) );

    assets.forEach( function(path){
      path.key = username + "/" +  appName  +  "/assets/" + path.name
      uploadPromises.push( uploadFile( path ));
    });
  
    apps.forEach( function(path){
      path.key = username + "/" +  appName  +  "/" + path.name
      uploadPromises.push( uploadFile( path ) );
    });

    deps.forEach( function(path){
      path.key = username + "/dependencies/" + path.name
      uploadPromises.push( uploadFile( path ) );
    });

    Q.all( uploadPromises )
    .then( function(){ return deferred.resolve() })
    .fail( function(error){ return deferred.reject( error ) })

    return deferred.promise;
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Updates the Package Information in the 3VOT Platform
  _3upload.prototype.updatePackageInfo= function(){
    stages.push["uploadAssets"]
    packageInfo.set("username", username)
    packageInfo.set("name", appPackage.name)
    packageInfo.set("version", appPackage.version);
    packageInfo.addUnique("versions", appPackage.version )
    packageInfo.addUnique("versionMap", {version: appPackage.version, versionId: versionId} )
    packageInfo.save( null, { success: function(pck){ console.log( ("App Updated Succesfully: http://demo.3vot.com/" + username + "/" + appName ).green) }  } );
    stages.push["updatePackageInfo"]  
  }
  
  //
  // Parms: 
  // Returns: Promise
  // Desc: Reverts the Package Information to previous state in case of Error.
  _3upload.prototype.undoUpdatePackageInfo= function(){

    if (stages.indexOf("updatePackageInfo") == -1){
      console.info("There is no need to undo Package Info Update, never updated".yellow)
      return false;
    }
    stages.push["undoUpdatePackageInfo"]  
    console.info("Undoing last Update to Package Info".yellow)
    originalPackageInfo.save( null, { success: function(pck){ console.log("App Reverted to Original State Succesfully".green) }  } );

    return true;
  }
  
  return _3upload;
})();

module.exports = _3upload;