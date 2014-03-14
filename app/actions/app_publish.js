var Aws = require("aws-sdk");
var Path = require("path")
var fs = require("fs")
var Q = require("q");

var Transform = require("../utils/transform")

var AwsCredentials = require("../aws/credentials");
var AwsHelpers = require("../aws/helpers");

var App = require("../models/app")

var promptOptions = {
  user_name: null,
  app_name: null,
  app_version: null,
  paths: null
}

var tempVars= {
  app: null,
  indexFileContents: null,
  app_keys: null,
  dep_keys: null
}

function execute(options){
  console.log("Publishing Apps to the 3VOT Platform")
  var deferred = Q.defer();
  
  if( !options.paths ) options.paths = { sourceBucket: "source.3vot.com", productionBucket: "3vot.com", demoBucket: "demo.3vot.com"}
  
  promptOptions = options;

  getApp()
  .then( function(){ return AwsCredentials.requestKeysFromProfile( promptOptions.user_name) })
  .then( listAppKeys )
  .then( function(){ return copyKeys(tempVars.app_keys) })
  .then( listDepKeys )
  .then( function(){ return copyKeys(tempVars.dep_keys) })
  .then( listAssetKeys )
  .then( transformKeys )
  .then(function(){ return deferred.resolve(tempVars.app) } )
  .fail( function(err){ return deferred.reject(err); } )

  return deferred.promise;
}

function getApp(){
  var deferred = Q.defer();
  
  callbacks={
    done: function(response){
      if(response.body.length == 0) throw "App not found, or Wrong Keys+Username pair" 
      tempVars.app = App.last()
      if(!promptOptions.app_version) promptOptions.app_version = tempVars.app.version
      return deferred.resolve( this ) 
    },
    fail: function(error){        
      return deferred.reject( error )
    }
  }
  
  App.fetch( { query: { select: App.querySimpleByNameAndProfileSecurity, values: [ promptOptions.user_name, promptOptions.app_name ] }  }, callbacks )
  
  return deferred.promise;
}

function listAppKeys(){
  console.log("Listing App Keys")
  var deferred = Q.defer();

  var marker= promptOptions.user_name + "/" + tempVars.app.name + "_" + promptOptions.app_version
  AwsHelpers.listKeys( promptOptions.paths.demoBucket, marker )
  .then( function( keys ){ tempVars.app_keys = keys; return deferred.resolve(keys);  })
  .fail( function(err){ return deferred.reject(keys); }  );
  
  return deferred.promise;
}


function listDepKeys(){
  console.log("Listing App Keys")
  var deferred = Q.defer();

  var marker= promptOptions.user_name + "/dependency"
  AwsHelpers.listKeys( promptOptions.paths.demoBucket, marker )
  .then( function( keys ){ tempVars.app_keys = keys; return deferred.resolve(keys);  })
  .fail( function(err){ return deferred.reject(keys); }  );
  
  return deferred.promise;
}

function copyKeys(){
  console.log(("Copying all Keys in Bucket " + promptOptions.paths.demoBucket + " to " + promptOptions.paths.productionBucket ).grey);
  
  var deferred = Q.defer();
  var indexFound = false;
   uploadPromises = []
   tempVars.app_keys.forEach(function(key){
     var newKey = key.Key.replace("_" + promptOptions.app_version, "");
     uploadPromises.push( AwsHelpers.copyKey( promptOptions.paths.productionBucket, promptOptions.paths.demoBucket + "/" + key.Key , newKey ) );
   });
   
   Q.all( uploadPromises )
   .then( function(results){ return deferred.resolve( results ) })
   .fail( function(error){ return deferred.reject( error ) });
   
   return deferred.promise;
}

function listAssetKeys(){
  console.log("Listing Asset Keys")
  
  var deferred = Q.defer();
  var marker= promptOptions.user_name + "/" + tempVars.app.name + "_" + promptOptions.app_version + "/assets"
  AwsHelpers.listKeys( promptOptions.paths.demoBucket, marker )
  .then( function( keys ){ tempVars.asset_keys = keys; return deferred.resolve(keys);  })
  .fail( function(err){ return deferred.reject(keys); }  );
  
  return deferred.promise;
}

function transformKeys(){
  var deferred = Q.defer();
  var transformPromises = []
  tempVars.asset_keys.forEach(function(key){
    var productionKey = key.Key.replace("_" + promptOptions.app_version, "");

    if(productionKey.indexOf(".html") > 0 || productionKey.indexOf(".js") > 0 || productionKey.indexOf(".css") > 0 ){
      transformPromises.push(updateObjectToProduction(productionKey)); 
    }
  });
  
  tempVars.app_keys.forEach(function(key){
    var productionKey = key.Key.replace("_" + promptOptions.app_version, "");

    if(productionKey.indexOf(".html") > 0 || productionKey.indexOf(".js") > 0 || productionKey.indexOf(".css") > 0 ){
      transformPromises.push(updateObjectToProduction(productionKey)); 
    }
  });
  
  Q.all( transformPromises )
  .then( function(results){ return deferred.resolve( results ) })
  .fail( function(error){ return deferred.reject( error ) });
  
  return deferred.promise;
}
  
function updateObjectToProduction(key){
  var deferred = Q.defer();
  
  getObjectFromBucket(productionKey)
  .then( adjustObjectToProduction )
  .then( uploadObjectToProduction )
  .then( deferred.resolve )
  .fail( deferred.reject )  
  
  return deferred.promise;
  
}
  
function getObjectFromBucket(key){
  var deferred = Q.defer();

  AwsHelpers.getObjectFromBucket( promptOptions.paths.productionBucket, key )
  .then( function(data){ return deferred.resolve( { data: data, key: key })  }  )
  .fail( function(err){ return deferred.reject(err)  }  )
  
  return deferred.promise;
}
  
function adjustObjectToProduction(fileObject){
  console.log(("Adjusting File for Production " + promptOptions.paths.demoBucket + " to " +  promptOptions.paths.productionBucket ).grey);
  fileObject.data = Transform.production(fileObject.data, promptOptions.user_name ,tempVars.app);
  return fileObject;
}
  
function uploadObjectToProduction( fileObject ){
  console.log( ("Uploading Transformed File for Production " ).grey);
  
  var deferred = Q.defer();
  
  AwsHelpers.uploadFile( promptOptions.paths.productionBucket , 
    { 
      body: fileObject.data,
      key: fileObject.key,
      path: promptOptions.paths.productionBucket + fileObject.key
    }
  ).then(  function(){ return deferred.resolve()  } )
  .fail(  function(){ return deferred.reject()  } )    
  
  return deferred.promise
}

module.exports = execute;