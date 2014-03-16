
var Q = require("q")

var Store = require("../models/store")
var Path = require("path");

var Template= require("../utils/template")

var AwsCredentials = require("../aws/credentials");
var AwsHelpers = require("../aws/helpers");

var promptOptions= {
  user_name: null,
  public_dev_key: null
}

var tempVars = {
  profile: null,
  stores: null,
  indexFileObject: null
}

function execute(options){
  var deferred = Q.defer();
  if( !options.paths ) options.paths = { sourceBucket: "source.3vot.com", productionBucket: "3vot.com", demoBucket: "demo.3vot.com"}
  
  promptOptions = options;
  
  getStoresAndApps()
  .then( function(){ return AwsCredentials.requestKeysFromProfile( promptOptions.user_name) })
  .then( deployProfileHtml )
  .then( uploadProfileHtml  )
  .then( function(){ deferred.resolve(tempVars.profile)   } )
  .fail( function(error){ return deferred.reject(error)  } )  

  return deferred.promise;
}

function getStoresAndApps(){
  
  var deferred = Q.defer();

  callbacks={
    done: function(data){
      tempVars.profile = data;
      tempVars.stores = data.stores;
      return deferred.resolve( this ) 
    },
    fail: function(error){        
      return deferred.reject( error )
    }
  }
  
  Store.one("viewSuccess", callbacks.done)
  Store.one("viewError", callbacks.fail)
  
  Store.callView( "with_apps", { user_name: promptOptions.user_name, public_dev_key: promptOptions.public_dev_key } )

  return deferred.promise;
}

function deployProfileHtml(){
  console.info("Generating Profile HTML".grey)
  
  var deferred = Q.defer();
  
  var templatePath = Path.join( process.cwd(), "profile_template.eco") ;
  
  Template.store(tempVars.profile, tempVars.stores, templatePath, generateAsync );

  function generateAsync(profileHTML){
    tempVars.indexFileObject = { 
      body: profileHTML, 
      path: promptOptions.user_name + "/index.html", 
      key: promptOptions.user_name + "/index.html"  
    }  
    deferred.resolve(tempVars.indexFileObject);
  }
  
  return deferred.promise;
}

function uploadProfileHtml(){
  console.info("Uploading Profile HTML".grey)
  
  var deferred = Q.defer();
  
  AwsHelpers.uploadFile( promptOptions.paths.productionBucket , tempVars.indexFileObject )
  .then( function(){ console.log("Profile is available at: http://3vot.com/" + promptOptions.user_name )  } )
  .then( function(){ return deferred.resolve()  } )
  .fail( function(err){ return deferred.reject(err)  } );
  
  return deferred.promise;
}

module.exports = execute