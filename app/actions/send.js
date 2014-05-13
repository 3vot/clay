var Path = require("path")
var fs = require("fs")
var Q = require("q");

var Login = require("../salesforce/login");
var UploadVisualForce = require("../salesforce/upload");
var Render = require("../salesforce/render");
var Log = require("3vot-cloud/utils/log")

var UploadApp = require("3vot-cloud/app/upload")

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  password: null,
  app_name: null,
  target: null
}

var tempVars = {
  session: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;


  login( { password: promptOptions.password } )
  .then( uploadApp )
  .then( uploadVisualforce )
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

function uploadApp(){
  return UploadApp(promptOptions)

}

function uploadVisualforce(){

  var idParts = tempVars.session.id.split("/")
  var orgId = idParts[idParts.length - 2 ]

  var page = Render({ 
    app_name: promptOptions.app_name, 
    show_header: false, 
    user_name: promptOptions.user_name, 
    target: "production" 
  })

  return UploadVisualForce( { app_name: promptOptions.app_name, session: tempVars.session, page: page} )

}



module.exports = execute;