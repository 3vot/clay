var Q = require("q");
var colors = require('colors');
var Path = require('path');

var Builder = require("../utils/builder")

var App = require("../models/app")

var Install = require("../utils/install")


var promptOptions= { 
  app_name: null,
}

function execute( options ){
  console.info("Installing " +  options.app_name.yellow)
  
  var deferred = Q.defer();
  
  promptOptions = options;

  installDependencies()
  .then( function(){ return deferred.resolve(promptOptions.app_name) })
  .fail( function(err){ deferred.reject(err); })

  return deferred.promise;
}

function installDependencies(){
  var destinationDir = Path.join( "apps", promptOptions.app_name , "node_modules" );
  return Install(promptOptions.app_name, destinationDir) 
}

module.exports = execute;