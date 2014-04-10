var fs = require('fs');
var Q = require("q");
var colors = require('colors');
var mime = require('mime')
var Path = require('path');

var Profile = require("../models/profile")

var Store = require("../models/store")

var Log = require("../utils/log")

var promptOptions = {
  app_name: null,
  name: null,
  user_name: null,
  public_dev_key: null
}

var profile = {}

function add( options ){
  promptOptions = options;

  var deferred = Q.defer();  
  console.info( "Removing the app " + promptOptions.app_name + " from the store " + promptOptions.name )

  callbacks = {
    done: function(){
      deferred.resolve(promptOptions);
    },
    fail: function(err){
      deferred.reject(err);
    }
  }

  Store.callAction( "removeAppFromStore", { app_name: promptOptions.app_name, name: promptOptions.name, user_name: promptOptions.user_name, public_dev_key: options.public_dev_key }, callbacks )  
  
  return deferred.promise;
} 

module.exports = add;