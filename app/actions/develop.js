var Path = require("path")
var fs = require("fs")
var Q = require("q");

var Login = require("../salesforce/login");
var UploadVisualforce = require("../salesforce/visualforce");
var Render = require("../salesforce/render");
var Log = require("3vot-cloud/utils/log")
var open = require('open');


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


  login()
  .then( uploadApps )
  .then( launchServer )
  .then( deferred.resolve )
  .fail( deferred.reject );

  return deferred.promise;
}

function login(){
  var deferred = Q.defer();
  
  Login(promptOptions)
  .then( function(session){
    tempVars.session = session;
    return deferred.resolve();
  })
  .fail( deferred.reject )

  return deferred.promise;

}

function uploadApps(){
  var deferred = Q.defer();

  var idParts = tempVars.session.id.split("/")
  var orgId = idParts[idParts.length - 2 ]
  promptOptions.promptValues.target = "localhost"
  tempVars.page = Render(promptOptions)
  return UploadVisualforce( promptOptions, tempVars )

}

function launchServer(options){

  var Server = require("../server")
  return options;
}

module.exports = execute;