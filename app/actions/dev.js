var Path = require("path")
var fs = require("fs")
var Q = require("q");

var Login = require("../salesforce/login");
var Upload = require("../salesforce/upload");
var Render = require("../salesforce/render");
var Log = require("3vot-cloud/utils/log")


var promptOptions = {
  user_name: null,
  password: null,
  app_name: null,
  target: null,
  unmanned: null
}

var tempVars = {
  session: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;


  login( { password: promptOptions.password } )
  .then( uploadApps )
  .then( launchServer )
  .then( deferred.resolve )
  .fail( deferred.reject );

  return deferred.promise;
}

function login(options){
  var deferred = Q.defer();

  if(!promptOptions.password){
    process.nextTick( deferred.resolve )
  }
  else{
    Login(options)
    .then( function(session){
      tempVars.session = session;
      return deferred.resolve();
    })
    .fail( deferred.reject )
  }
  
  return deferred.promise;

}

function uploadApps(){
  var deferred = Q.defer();

  
  if(promptOptions.app_name){
    var idParts = tempVars.session.id.split("/")
    var orgId = idParts[idParts.length - 2 ]

    var page = Render({ 
      app_name: promptOptions.app_name, 
      show_header: false, 
      user_name: promptOptions.user_name, 
      target: "localhost" ,
      unmanned: promptOptions.unmanned
    })
    return Upload( { target: "localhost", app_name: promptOptions.app_name, session: tempVars.session, page: page} )
  }

  else{
    process.nextTick(function(){
      deferred.resolve()
    })
  }

  return deferred.promise;
}

function launchServer(){

  var Server = require("../server")

}

module.exports = execute;