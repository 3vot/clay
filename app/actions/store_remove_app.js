var fs = require('fs');
var Q = require("q");
var colors = require('colors');
var mime = require('mime')
var Path = require('path');

var Profile = require("../models/profile")

var Store = require("../models/store")

var promptOptions = {
  app: null,
  name: null,
  user_name: null,
  public_dev_key: null
}

var profile = {}

function add( options ){
  promptOptions = options;
  console.info("Removing an app in your 3VOT Store".yellow)
  var deferred = Q.defer();

  callbacks = {
    done: function(){
      deferred.resolve(this);
    },
    fail: function(err){
      deferred.reject(err);
    }
  }

  Store.callAction( "removeAppFromStore", { app: promptOptions.app, name: options.name, user_name: promptOptions.user_name, public_dev_key: options.public_dev_key }, callbacks )  
  
  return deferred.promise;
} 

module.exports = add;