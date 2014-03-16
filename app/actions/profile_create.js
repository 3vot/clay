var fs = require('fs');
var Q = require("q");
var colors = require('colors');
var mime = require('mime')
var Path = require('path');

var Profile = require("../models/profile")

var promptOptions = {
  name: null,
  user_name: null,
  email: null
}

function create( options ){
  promptOptions = options;
  console.info("Creating a Profile in the 3VOT Platform".yellow)
  var deferred = Q.defer();

  callbacks = {
    done: function(){
      promptOptions.public_dev_key = this.security.public_dev_key;
      return deferred.resolve(promptOptions);
    },
    fail: function(err){
      return deferred.reject(err);
    }
  }

  Profile.create( { user_name: options.user_name, marketing: { name: options.name }, security: {}, contacts: { owner: { email: options.email } } }, callbacks )
  return deferred.promise;
} 

module.exports = create;