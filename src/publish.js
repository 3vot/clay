var Aws = require("aws-sdk");
var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
Q.longStackSupport = true;
var prompt = require("prompt")

var Upload = require("./upload")

var AwsCredentials = require("./aws/credentials");
var AwsHelpers = require("./aws/helpers");

var Profile = require("./model/profile")
var Package = require("./model/package")


Publish = (function() {

  Publish.prompt = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'name', description: 'App: ( The Name of the App you want to publish )' },
      { name: 'version', description: 'Version: ( The Version of the App you want to publish )' } ], function (err, result) {

        var publish = new Publish( result, { sourceBucket: "demo.3vot.com", destinationBucket: "3vot.com"} )
        publish.publishApp()
        .then( function(){ console.log("App Published Succesfully".green); } )
        .fail( function(err){ console.log("Error Publishing App"); console.error(err); })
    });
  }
  
  var app = {}
  var paths = {}

  //source, destination, name, version 
  function Publish( attr, attrPaths ) {
    app.version = attr.version;
    app.name = attr.name;
    paths = attrPaths;
    app.package = require( Path.join(process.cwd(), "apps", app.name, "package.json" ) );
    app.indexFileContents = "";
  }

  Publish.prototype.publishApp = function(){
    var deferred = Q.defer();
    
    console.log("Publishing Apps")

    this.getProfile()
    .then( this.getPackage )
    .then( AwsCredentials.requestKeysFromProfile )    
    .then( this.listAppKeys )
    .then( this.copyKeys )
    .then( this.listDepKeys )
    .then( this.copyKeys )
    .then( this.getObjectFromBucket )
    .then( this.adjustIndexToProduction )
    .then( this.uploadAjustedIndex )
    .then( this.updatePackageInfo )
    .then( deferred.resolve )
    .fail( 
      function(err){ return deferred.reject(err); }  
    )

    return deferred.promise;
  }

  Publish.prototype.getProfile= function(){
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

  Publish.prototype.getPackage= function(){
    var deferred = Q.defer();
    Package.findByAttributes( { "username": app.profile.get("username"), "name": app.name  } )
    .then( function(results){
      if(results.length===0) return deferred.reject("App Not Found")
      app.packageData = results[0];
      return deferred.resolve(app.packageData);
    })
    .fail( function(err){ deferred.reject(err) } )

    return deferred.promise;
  }

  Publish.prototype.listAppKeys = function(){
    console.log("Listing App Keys")
    var deferred = Q.defer();

    var marker= app.profile.get("username") + "/" + app.package.name + "_" + app.version
    AwsHelpers.listKeys( paths.sourceBucket, marker )
    .then( function( keys ){ return deferred.resolve(keys);  })
    .fail( function(err){ return deferred.reject(keys); }  );
    
    return deferred.promise;
  }

  Publish.prototype.listDepKeys = function(){
    console.log("Listing Dependency Keys")
    
    var deferred = Q.defer();
    var marker= app.profile.get("username") + "/dependencies" 
    AwsHelpers.listKeys( paths.sourceBucket, marker )
    .then( function( keys ){ return deferred.resolve(keys);  })
    .fail( function(err){ return deferred.reject(keys); }  );
    
    return deferred.promise;
  }

  Publish.prototype.copyKeys = function(keys){
    console.log(("Copying all Keys in Bucket " + paths.sourceBucket + " to " + paths.destinationBucket ).grey);
    
    var deferred = Q.defer();
    var indexFound = false;
     uploadPromises = []
     keys.forEach(function(key){
       var newKey = key.Key.replace("_" + app.version, "");
       uploadPromises.push( AwsHelpers.copyKey(paths.destinationBucket, paths.sourceBucket + "/" + key.Key , newKey ) );
     });
     
     Q.all( uploadPromises )
     .then( function(results){ return deferred.resolve( results ) })
     .fail( function(error){ return deferred.reject( error ) });
     
     return deferred.promise;
  }
  
  Publish.prototype.getObjectFromBucket = function(){
    var deferred = Q.defer();

    AwsHelpers.getObjectFromBucket( paths.destinationBucket, app.profile.get("username") + "/" + app.package.name + "/index.html" )
    .then( function(data){ app.indexFileContents = data; return deferred.resolve(data)  }  )
    .fail( function(err){ return deferred.reject(err)  }  )
    
    return deferred.promise;
  }
  
  Publish.prototype.adjustIndexToProduction = function(){
    console.log(("Adjusting Index File for Production " + paths.sourceBucket + " to " + paths.destinationBucket ).grey);
    var indexFileContents = app.indexFileContents.replace(paths.sourceBucket, paths.destinationBucket);
    indexFileContents = indexFileContents.replace(
      "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name + '_' + package.version;",
      "_3vot.path = '//' + _3vot.domain + '/' + package.profile + '/' + package.name;"
    );
    app.indexFileContents = indexFileContents;
    return indexFileContents;
  }
  
  Publish.prototype.uploadAjustedIndex = function(){
    var deferred = Q.defer();
    
    AwsHelpers.uploadFile( paths.destinationBucket , 
      { 
        body: app.indexFileContents, 
        key: app.profile.get("username") + "/" + app.name + "/index.html", 
        path: paths.sourceBucket + "/" + app.profile.get("username") + "/" + app.name + "_" + app.version + "/index.html" 
      }
    ).then(  function(){ return deferred.resolve()  } )
    .fail(  function(){ return deferred.reject()  } )    
    
    return deferred.promise
  }
  
  Publish.prototype.updatePackageInfo= function(){
    console.info("Saving Published Version".green)
    var deferred = Q.defer();
    app.packageData.set("versionPublished", app.version)
    Package.save(app.packageData)
    .then( function(){ deferred.resolve(); } )
    .fail( function(){ deferred.reject(); } )

    return deferred.promise 
  }
  
  return Publish;

})();

module.exports = Publish;



