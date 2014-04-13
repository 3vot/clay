var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")
var Log = require("../utils/log")
var Packs = require("../utils/packs")

var promptOptions = {
  instance_url: null,
  access_token: null,
  app_name: null,
  target: "localhost",
  page: ""
}

var tempVars = {
  pageResponse: null,
  session: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  
  var _3vot = Packs._3vot(true)
  tempVars.session = _3vot.salesforce.session;
  
  publishPage()
  .then( function(){ 
    if( promptOptions.target == "production" ) return true; 
    Log.info("*** READ THIS ***")
    Log.info( "1: First visit https://localhost:3000/" + promptOptions.user_name + " before using the Salesforce Visualforce Page.") 
    Lof.info("")
    return Log.info( "2: <head> is inserted to VF Page with this operation, any changes to template/head.html requires this command to be executed again.")
  })
  .then( function(){ 
    var url = tempVars.session.instance_url + "/apex/" + promptOptions.app_name
    if( promptOptions.target == "localhost" ) url += "_dev"
    return Log.info("App Available at: " + url) } )
  .then (function(){ return deferred.resolve() })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
}

function publishPage(){
  var deferred = Q.defer();
  var name = promptOptions.app_name

  if(promptOptions.target == "localhost") name += "_dev"

  var url = tempVars.session.instance_url + "/services/data/v29.0/sobjects/ApexPage/Name/" + name;
  
  Log.debug("Upserting Visualforce Page " + url, "salesforce/upload", 48)
  
  body = {
    Markup : promptOptions.page,
    ControllerType : 3,
    MasterLabel: name,
    ApiVersion: "29.0"
  }
  
  var req = request.patch(url)
  .type("application/json")
  .set('Authorization', 'Bearer ' + tempVars.session.access_token )
  .send(body)
  
  req.end(function(err,res){
    if(err) return deferred.reject(err)
    if( res.body[0] && res.body[0].errorCode ) return deferred.reject( "Salesforce.com rejected the upsert of a Visualforce Page with the HTML we send, it's posibly due to unvalid HTML. Please review your template files. ERROR: " + res.body[0].message )
    if( res.body.success == false || res.body.errorCode ) return deferred.reject( "ERROR: " + JSON.stringify( res.body ) )
    Log.debug("Visualforce Upserted Succesfully " + url, "salesforce/upload", 6)
    tempVars.pageResponse = res.body
    deferred.resolve(res.body)
  })

  return deferred.promise; 
}

module.exports = execute;