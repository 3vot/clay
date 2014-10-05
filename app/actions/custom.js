var Path = require("path")
var fs = require("fs")
var Q = require("q");

var Login = require("../salesforce/login");
var ListObjects = require("../salesforce/listObjects");
var Render = require("../salesforce/render");
var Log = require("3vot-cloud/utils/log")

var UploadApp = require("3vot-cloud/app/upload")
var UploadStatic = require("../salesforce/staticUpload")

var App = require("3vot-cloud/models/app")


var promptOptions = {
  public_dev_key: null,
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
  promptOptions.promptValues.target = "production"

  login( )
  .then( listObjects )
  
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



function listObjects(){
  return ListObjects( promptOptions, tempVars )

}

module.exports = execute;