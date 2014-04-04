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
  name: null,
  user_name: null,
  email: null
}

var tempVars ={
  profile: null,
  html: null
}

function execute(options){
    var deferred = Q.defer();
    promptOptions= options;
    
    create()
    .then( function(){ 
      console.log( ( "Save your developer key: " + tempVars.profile.security.public_dev_key ).bold) 
      return deferred.resolve( promptOptions ) ;
    })
    .fail( function(err){ return deferred.reject(err); } );
    
    return deferred.promise;
}


function create(){
  console.log("Creating your Profile")
  var deferred = Q.defer();

  callbacks = {
    done: function(){
      tempVars.profile = this;
      return deferred.resolve(promptOptions);
    },
    fail: function(err){
      return deferred.reject(err);
    }
  }

  Profile.create( { user_name: promptOptions.user_name, marketing: { name: promptOptions.name }, security: {}, contacts: { owner: { email: promptOptions.email } } }, callbacks )
  return deferred.promise;
} 

module.exports = execute;