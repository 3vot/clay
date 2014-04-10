var fs = require('fs');
var Q = require("q");
var colors = require('colors');
var mime = require('mime')
var Path = require('path');

var Profile = require("../models/profile")

var Store = require("../models/store")

var Log = require("../utils/log")

var promptOptions = {
  name: null,
  user_name: null,
  public_dev_key: null
}

function create( options ){
  promptOptions = options;

  Log.info( "Creating the store " + promptOptions.name )
  
  var deferred = Q.defer();

  callbacks = {
    done: function(){
      deferred.resolve(promptOptions);
    },
    fail: function(err){
      deferred.reject(err);
    }
  }

  Store.create( { name: options.name, user_name: options.user_name, public_dev_key: options.public_dev_key  }, callbacks )
  
  return deferred.promise;
} 

module.exports = create;