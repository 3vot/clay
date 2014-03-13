var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")
var prompt = require("prompt")

var Profile = require("../models/profile")
var App = require("../models/app")


var Aws = require("aws-sdk");
var fstream = require("fstream");
var tar = require("tar");
var zlib = require("zlib");
var colors = require('colors');
var mime = require('mime')

var AwsCredentials = require("../aws/credentials");
var AwsHelpers = require("../aws/helpers");

var _3vot = require("3vot")

var Builder = require("../utils/builder")
var Transform = require("../utils/transform")

var App = require("../models/app")

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  app_name: null,
  size: null,
  paths: null,
}

var tempVars = {
  app: null
}

function execute(options){
    var deferred = Q.defer();

    if( !options.paths ) options.paths = { sourceBucket: "source.3vot.com", productionBucket: "3vot.com", demoBucket: "demo.3vot.com"}
    promptOptions= options;
    
    createApp()
    .then( adjustPackage )
    .then( function(){ return AwsCredentials.requestKeysFromProfile( promptOptions.user_name) })
    .then( function(){ return Builder.buildApp(promptOptions.app_name) })
    .then( function(){ return Builder.buildDependency(promptOptions.app_name) })
    .then( buildPackage )
    .then( uploadSourceCode )
    .then( uploadAppFiles )
    .then( uploadAssetsFiles )
    .then( uploadDependenciesFiles )
    .then( function(){ 
      console.log("App Available at: http://" + promptOptions.paths.demoBucket + "/" + promptOptions.user_name + "/" + promptOptions.app_name +  "_" + tempVars.app.version )
      return deferred.resolve( tempVars.app ) ;
    })
    .fail( function(err){ return deferred.reject(err); } );
    
    return deferred.promise;
  }


function createApp(){
  var deferred = Q.defer();
  
  callbacks={
    done: function(){
      tempVars.app = this;
      return deferred.resolve( this ) 
    },
    fail: function(error){        
      return deferred.reject( error )
    }
  }

  App.create( { billing: { size: promptOptions.size }, name: promptOptions.app_name, public_dev_key: promptOptions.public_dev_key, user_name: promptOptions.user_name, marketing: { name: promptOptions.app_name } }, callbacks )
  
  return deferred.promise;
}


function adjustPackage(){
  var deferred = Q.defer();
  console.info("Adjusting the package.json for your Profile".yellow)
  var pck = require( Path.join( process.cwd(), "apps", tempVars.app.name, "package.json" )  );
  var vot = require( Path.join( process.cwd(), "3vot.json" )  )
  pck.user_name = vot.user_name;
  pck.version = "0.0." + tempVars.app.version

  fs.writeFile( Path.join( process.cwd(), "apps", tempVars.app.name, "package.json" ), JSON.stringify(pck,null,'\t') , function(err){
    if(err) return deferred.reject(err);
    deferred.resolve()
  });

  return deferred.promise;
}
function buildPackage(){
  console.log( ("Building App " + tempVars.app.name).green);
  var deferred = Q.defer();
  tempVars.app.package = require( Path.join( process.cwd(), "apps", tempVars.app.name, "package.json" ) )
  
  var appFolderReader = fstream.Reader(
    { path: 'apps/' + tempVars.app.name, 
      type: "Directory", 
      filter: function () {
        return !this.basename.match(/^\./) &&
               !this.basename.match(/^node_modules$/)
      }
   });

  var stream = appFolderReader.pipe(tar.Pack()).pipe(zlib.createGzip());
  stream.pipe( fstream.Writer( Path.join( process.cwd(), "tmp", tempVars.app.name + ".tar.gz") ) )

  stream.on("end", function(){
    var url = Path.join( process.cwd(), "tmp", tempVars.app.name + ".tar.gz")
    return deferred.resolve(url);
  });

  stream.on("error", function(error){
    return deferred.reject(new Error(error) );
  });
  return deferred.promise;
}


function uploadSourceCode(){
  console.info("Uploading Package to 3VOT App Store".yellow)
  var deferred = Q.defer();
  var file = fs.readFileSync( Path.join( process.cwd(), 'tmp', tempVars.app.name + '.tar.gz'));

  var key = promptOptions.user_name + '/' + tempVars.app.name  + "_" +  tempVars.app.version  + '.3vot';

  var s3 = new Aws.S3();
  s3.putObject( { Body: file , Key: key, Bucket: promptOptions.paths.sourceBucket }, function(s3Error, data) {
    console.log(s3Error)
    if (s3Error) return deferred.reject(s3Error);
    console.info("Package Uploaded Correctly to 3VOT App Store".green)
    deferred.resolve(data)
  });
  return deferred.promise;
}


function uploadAppFiles(){
  console.info("Uploading App to 3VOT Demo".yellow)
  
  var deferred = Q.defer();
  var _this = this;

  uploadPromises = []
  var apps = walkDir( Path.join( process.cwd(), "apps", tempVars.app.name, "app" ) );

  apps.forEach( function(path){
    if(path.name == "index.html"){
      var file = fs.readFileSync( path.path, "utf-8"  );
      file = Transform.transformToDemo(file, promptOptions.user_name, tempVars.app);
      fs.writeFileSync( path.path, file );
    }
    path.key = promptOptions.user_name + "/" +  tempVars.app.name  +  "_" + tempVars.app.version + "/" + path.name
    uploadPromises.push( AwsHelpers.uploadFile( promptOptions.paths.demoBucket, path ) );
  });

  Q.all( uploadPromises )
  .then( function(){ return deferred.resolve() })
  .fail( function(error){ return deferred.reject( error ) })

  return deferred.promise;
}

function uploadAssetsFiles(){
  console.info("Uploading Assets to 3VOT Demo".yellow)
  
  var deferred = Q.defer();
  var uploadPromises = []
 
  var assets = walkDir( Path.join( process.cwd(), "apps", tempVars.app.name, "app",  "assets" ) );
 
  assets.forEach( function(path){
    path.key = promptOptions.user_name + "/" +  tempVars.app.name + "_" + tempVars.app.version + "/assets/" + path.name
    uploadPromises.push( AwsHelpers.uploadFileRaw( promptOptions.paths.demoBucket, path ));
  });
  
   Q.all( uploadPromises )
    .then( function(){ return deferred.resolve() })
    .fail( function(error){ return deferred.reject( error ) })

  return deferred.promise;  
}

function uploadDependenciesFiles(){
  console.info("Uploading Dependencies to 3VOT Demo".yellow)
  
  var deferred = Q.defer();
  var uploadPromises = []
 
  var deps = walkDir( Path.join( process.cwd(), "apps", "dependencies" ) );
 
  deps.forEach( function(path){
    path.key = promptOptions.user_name + "/dependencies/" + path.name
    uploadPromises.push( AwsHelpers.uploadFile( promptOptions.paths.demoBucket, path ) );
  });
  
   Q.all( uploadPromises )
    .then( function(){ return deferred.resolve() })
    .fail( function(error){ return deferred.reject( error ) })
  
  return deferred.promise;
  
}

function walkDir(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(sourceFile) {
    file = Path.join( dir, sourceFile );
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()){ }
    else{ results.push({path: file, name: sourceFile }); }
  })
  return results;
}

module.exports = execute;