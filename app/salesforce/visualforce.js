var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")

var promptOptions = {
  session: null,  
  app_name: null,
  target: "localhost",
  page: "",
  publish: ""
}

var tempVars = {
  pageResponse: null,
  session: null
}

function execute(options, vars){
  var deferred = Q.defer();
  promptOptions = options;
  tempVars = vars;

  publishPage()
  .then( function(){ 
    var url = tempVars.session.instance_url + "/apex/" + promptOptions.package.name 
    if( promptOptions.promptValues.target == "localhost" ) url += "_dev"
    else if( promptOptions.promptValues.publish == false ) url += "_" + promptOptions.package.threevot.version
    tempVars.url = url;
    return Log.info("App Available at: " + url) } )
  .then (function(){ return deferred.resolve(tempVars) })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
}

function publishPage(){
  var deferred = Q.defer();
  var name = promptOptions.package.name;

  if(promptOptions.promptValues.target == "localhost") name += "_dev"
  else if( promptOptions.promptValues.publish == false ) name += "_" + promptOptions.package.threevot.version;


  var url = tempVars.session.instance_url + "/services/data/v30.0/sobjects/ApexPage/Name/" + name 
  
  body = {
    Markup : tempVars.page,
    ControllerType : 3,
    MasterLabel: name,
    ApiVersion: "30.0"
  }

  Log.debug("Upserting Visualforce Page " + url, "salesforce/upload", 48)


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