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
var AwsHelpers = require("./aws/helpers");

var _3vot = require("3vot")

var Builder = require("./builder")
var Transform = require("./transform")

var Profile = require("./model/profile")
var Package = require("./model/package")


//TODO: Must request this variables in a Safe Way

// *****************
// CLI
// *****************
var Upload;

Upload = (function(){

  var paths= {
    destinationBucket: "demo.3vot.com"
  }

  var app = {
    name: "",
    username: "",
    profile: "",
    package: "",
    packageData: ""
  }

  Upload.prompt = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'app', description: 'App: ( the name of the app you want to upload  )' }], function (err, result) {
      var pkg = Path.join(process.cwd(), "package.json");
      var upload = new Upload( result.app )

      
      Builder.buildDependency( result.app )
      .then( function(){ return Builder.buildApp( result.app );  } )
      .then( function(){ return upload.uploadApp() } )
      .fail( function(err){ console.error(err); } )

    })
  }

  function Upload( appname ) {
    app.name = appname;
  }

  // Upload App Flow
  Upload.prototype.uploadApp = function( ){
    var deferred = Q.defer();

    appPackage = require( Path.join( process.cwd(), "apps", app.name, "package.json" ))

    console.log( ( "Uploading App: " + app.name).yellow );
    
    console.log("Should move Builder Commands to this line")
    
    this.buildPackage(app.name)
    .then( this.getProfile )
    .then( AwsCredentials.requestKeysFromProfile )
    .then( this.getPackage )
    .then( this.uploadPackage )
    .then( this.uploadAppFiles )
    .then( this.uploadAssetsFiles )
    .then( this.uploadDependenciesFiles )
    .then( this.updatePackageInfo )
    .then( deferred.resolve )
    .fail( function(error){ 
      deferred.reject(error);
    });

    return deferred.promise;

  }

  // **************
  // OOT Functions
  // ( do only one thing  )  
  // **************

  //Builds a Package ( tar.gz ) from a folder
  // Parms: app.name : The Name of the App/Folder inside the "apps" folder
  // Returns: Promise
  // Desc: Simply packs all files in the folder in a tar.gz
  Upload.prototype.buildPackage = function(){
    console.log( ("Building App " + app.name).green);
    var deferred = Q.defer();
    app.package = require( Path.join( process.cwd(), "apps", app.name, "package.json" ) )
    
    var appFolderReader = fstream.Reader({ path: 'apps/' + app.name
                           , type: "Directory"
                           , filter: function () {
                                return !this.basename.match(/^\./) &&
                                       !this.basename.match(/^node_modules$/)
                              }
                           })
    
    var stream = appFolderReader.pipe(tar.Pack()).pipe(zlib.createGzip());
    stream.pipe( fstream.Writer( Path.join( process.cwd(), "tmp", app.name + ".tar.gz") ) )

    stream.on("end", function(){
      var url = Path.join( process.cwd(), "tmp", app.name + ".tar.gz")
      return deferred.resolve(url);
    });

    stream.on("error", function(error){
      return deferred.reject(new Error(error) );
    });
    return deferred.promise;
  }

  Upload.prototype.getProfile= function(){
    var config = require(Path.join( process.cwd(), "3vot.json") );
    var deferred = Q.defer();
    Profile.findByAttributes( { "public_dev_key": config.key } )
    .then( function(results){
      if(results.length === 0){ return deferred.reject("We could not find a profile with the provided key. Check Configuration in 3vot.json")  }
      app.profile = results[0];
      app.username = app.profile.get("username")
      return deferred.resolve( app.profile );
    })
    .fail( function(err){ deferred.reject(err) } )
    
    return deferred.promise;
  }

  Upload.prototype.getPackage= function(){
    var deferred = Q.defer();
    Package.findByAttributes( { "username": app.username, "name": app.name  } )
    .then( function(results){
      app.packageData = results[0]
      
      if (app.packageData === undefined){
        var Packages = Parse.Object.extend("Packages");
        app.packageData = new Packages();
        app.packageData.set("version", "0.0.0");
      }    
      if(Semver.gt( app.packageData.get("version") , app.package.version )){
        deferred.reject("App Version in apps/" + app.name + "/package.json should be greater than " + app.packageData.attributes.version)
      }
      return deferred.resolve(app.packageData);
    })
    .fail( function(err){ deferred.reject(err) } )

    return deferred.promise;
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Uploads the Package tar.gz file to 3VOT Distibuted File Server
  Upload.prototype.uploadPackage= function (){
    console.info("Uploading Package to 3VOT App Store".yellow)
    var deferred = Q.defer();
    var file = fs.readFileSync( Path.join( process.cwd(), 'tmp', app.name + '.tar.gz'));
    
    var s3 = new Aws.S3();
    s3.putObject( { Body: file , Key: app.username + '/' + app.name  + "_" +  app.package.version  + '.3vot', Bucket: 'source.3vot.com' }, function(s3Error, data) {
      if (s3Error) return deferred.reject(s3Error);
      console.info("Package Uploaded Correctly to 3VOT App Store".green)
      deferred.resolve(data)
    });
    return deferred.promise;
  }


  Upload.prototype.uploadAppFiles = function(){
    console.info("Uploading App to 3VOT Demo".yellow)
    
    var deferred = Q.defer();
    var _this = this;

    uploadPromises = []
    var apps = Upload.walkDir( Path.join( process.cwd(), "apps", app.name, "app" ) );
 
    apps.forEach( function(path){
      if(path.name == "index.html"){
        var file = fs.readFileSync( path.path, "utf-8"  );
        file = Transform.transformToDemo(file, app.package);
        fs.writeFileSync( path.path, file );
      }
      path.key = app.username + "/" +  app.name  +  "_" + app.package.version + "/" + path.name
      uploadPromises.push( AwsHelpers.uploadFile( 'demo.3vot.com', path ) );
    });

    Q.all( uploadPromises )
    .then( function(){ return deferred.resolve() })
    .fail( function(error){ return deferred.reject( error ) })

    return deferred.promise;
  }

  Upload.prototype.uploadAssetsFiles = function(){
    console.info("Uploading Assets to 3VOT Demo".yellow)
    
    var deferred = Q.defer();
    var uploadPromises = []
   
   
    var assets = Upload.walkDir( Path.join( process.cwd(), "apps", app.name, "app",  "assets" ) );
   
    assets.forEach( function(path){
      path.key = app.username + "/" +  app.name + "_" + app.package.version + "/assets/" + path.name
      uploadPromises.push( AwsHelpers.uploadFile( paths.destinationBucket, path ));
    });
    
     Q.all( uploadPromises )
      .then( function(){ return deferred.resolve() })
      .fail( function(error){ return deferred.reject( error ) })
    
    
    return deferred.promise;
    
  }

  Upload.prototype.uploadDependenciesFiles = function(){
    console.info("Uploading Dependencies to 3VOT Demo".yellow)
    
    var deferred = Q.defer();
    var uploadPromises = []
   
    var deps = Upload.walkDir( Path.join( process.cwd(), "apps", "dependencies" ) );
   
    deps.forEach( function(path){
      path.key = app.username + "/dependencies/" + path.name
      uploadPromises.push( AwsHelpers.uploadFile( paths.destinationBucket, path ) );
    });
    
     Q.all( uploadPromises )
      .then( function(){ return deferred.resolve() })
      .fail( function(error){ return deferred.reject( error ) })
    
    return deferred.promise;
    
  }

  Upload.prototype.updatePackageInfo= function(){
    app.packageData.set("username", app.username)
    app.packageData.set("name", app.package.name)
    app.packageData.set("version", app.package.version);
    app.packageData.addUnique("versions", app.package.version )
    app.packageData.addUnique("versionMap", { version: app.package.version } )
    app.packageData.save( null, { success: function(pck){ console.log( ("App Updated Succesfully: http://demo.3vot.com/" + app.username + "/" + app.name + "_" + app.package.version ).green) }  } );
  }
  
  Upload.walkDir = function(dir) {
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
  
  return Upload;

})();

module.exports = Upload;