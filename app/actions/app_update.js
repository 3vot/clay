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

var AppBuild = require("./app_build")
var WalkDir = require("../utils/walk")

var App = require("../models/app")

var _3Ajax = require("3vot-model/lib/ajax");

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  app_name: null,
  size: null,
  paths: null,
}

var tempVars = {
  app: null,
  package_json: null,
  app_version: 1
}

function execute(options){
    var deferred = Q.defer();

    if( !options.paths ) options.paths = { sourceBucket: "source.3vot.com", productionBucket: "3vot.com", demoBucket: "demo.3vot.com"}
    promptOptions= options;
    
    tempVars.package_json = require( Path.join( process.cwd(), "apps", promptOptions.app_name, "package.json" )  );
    
    
    updateApp()
    .then( deferred.resolve )
    .fail( deferred.reject );
    
    return deferred.promise;
}


function updateApp(){
  var deferred = Q.defer();
  
  badCallbacks={
    done: function(){
      return deferred.reject( "should not be called because it's ajax disabled" )
    },
    fail: function(error){        
      return deferred.reject( error )
    }
  }

  callbacks={
    done: function(){    
      console.log("updating app")

      tempVars.app = this;
      return deferred.resolve( this ) 
    },
    fail: function(error){ 
      return deferred.reject( error )
    }
  }

  var app;
  _3Ajax.request.disable(function(){
    app = App.create( { app_name: promptOptions.app_name, user_name: promptOptions.user_name, public_dev_key: promptOptions.public_dev_key }, badCallbacks )
  })
  
  app.marketing = { name: tempVars.package_json.threevot.displayName, description: tempVars.package_json.description }
  app.save(callbacks)
  
  
  return deferred.promise;
}

module.exports = execute;