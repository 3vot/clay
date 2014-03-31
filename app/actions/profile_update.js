var fs = require('fs');
var Q = require("q");
var colors = require('colors');
var mime = require('mime')
var Path = require('path');
var request = require("superagent")

var AwsCredentials = require("../aws/credentials");
var AwsHelpers = require("../aws/helpers");

var Profile = require("../models/profile")

var promptOptions = {
  user_name: null,
}

var tempVars ={
  profile: null,
  html: null
}

function execute(options){
    var deferred = Q.defer();
    console.log("Updating your 3VOT Profile Web Page")
    
    if( !options.paths ) options.paths = { sourceBucket: "source.3vot.com", productionBucket: "3vot.com", demoBucket: "demo.3vot.com"}
    promptOptions= options;
    
    createDefaultProfileApp()
    .then( function(){ return AwsCredentials.requestKeysFromProfile( promptOptions.user_name) })
    .then( uploadDefaultProfileApp )
    .then( function(){  
      console.log("Your Profile is located at: http://3vot.com/" + promptOptions.user_name )
      return deferred.resolve() ;
    })
    .fail( function(err){ return deferred.reject(err); } );
    
    return deferred.promise;
}

function createDefaultProfileApp(){
  var deferred = Q.defer();
  
  request.get("http://3vot.com/template/main/index.html").end(function(err,res){
    if(err) return deferred.reject(err)
    tempVars.html = res.text;
    return deferred.resolve()
  })
  
  return deferred.promise;
}

function uploadDefaultProfileApp(){
  var path = {}
  path.key = promptOptions.user_name + "/index.html"
  path.body = tempVars.html
  path.path = "index.html"

  return AwsHelpers.uploadFileRaw( promptOptions.paths.productionBucket, path )
}


module.exports = execute;