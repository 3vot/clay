var fs = require('fs');
var Q = require("q");
var colors = require('colors');
var mime = require('mime')
var Path = require('path');
var request = require("superagent")
var AwsCredentials = require("../aws/credentials");
var AwsHelpers = require("../aws/helpers");
var Profile = require("../models/profile")
var Log = require("../utils/log")
var location = "./apps/"

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
  Log.debug("Creating Profile Object", "actions/profile_create", 26)
  
  create()
  .then( function(){ 
    promptOptions.public_dev_key = tempVars.profile.security.public_dev_key
    Log.info( "Here is your developer key: " + tempVars.profile.security.public_dev_key ) 
    return deferred.resolve( promptOptions ) ;
  })
  .fail( function(err){ 
    Log.error(err, "actions/profile_create",35)
    return deferred.reject(err); } 
  );
  return deferred.promise;
}


function create(){
  var deferred = Q.defer();

  callbacks = {
    done: function(){
      Log.debug("Profile Object Created", "actions/profile_create", 48)
      tempVars.profile = this;
      return deferred.resolve(promptOptions);
    },
    fail: function(err){
      Log.debug("Error creating Profile Object", "actions/profile_create", 56)
      return deferred.reject(err);
    }
  }

  Profile.create( { user_name: promptOptions.user_name, marketing: { name: promptOptions.name }, security: {}, contacts: { owner: { email: promptOptions.email } } }, callbacks )
  return deferred.promise;
} 

module.exports = execute;