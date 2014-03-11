var Q = require("q");
var colors = require('colors');
var Path = require('path');

var Builder = require("../utils/builder")

var App = require("../models/app")



var promptOptions= { 
  app_name: null,
}

function execute( options ){
  console.info("Building " +  options.app_name.yellow)
  
  var deferred = Q.defer();
  
  promptOptions = options;

  Builder.buildApp( promptOptions.app_name )
  .then( function(){ return Builder.buildDependency(promptOptions.app_name) })
  .then( function(){ return deferred.resolve(promptOptions.app_name) })
  .fail( function(err){ deferred.reject(err); })

  return deferred.promise;
}

module.exports = execute;