var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  app_name: null,
  salesforce: null,
  target: "localhost",
  page: ""
}

var tempVars = {
  salesforce: null,
  pageResponse: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  
  values("username")
  values("password")
  values("key")

  login()
  .then( publishPage )
  .then( function(){ 
    if( promptOptions.target == "production" ) return true; 
    console.log( "NOTE 1: THE FIRST TIME visit https://localhost:3000/" + promptOptions.user_name + " before using the Salesforce Visualforce Page, as localhost SSL is not trusted.") 
    return console.log( "NOTE 2: <head> is inserted to VF Page with this operation, any changes to template/head.html requires this command to be executed again.")
  })
  .then( function(){ 
    var url = tempVars.salesforce.instance_url + "/apex/" + promptOptions.app_name
    if( promptOptions.target == "localhost" ) url += "_dev"
    return console.log("App Available at: " + url) } )
  .then (function(){ return deferred.resolve() })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
}

function login(){
  var deferred = Q.defer();

  var url = "https://login.salesforce.com/services/oauth2/token";
  body = {
    grant_type: "password",
    client_id: "3MVG9A2kN3Bn17hvlSRXnnVzjDNILmhSt.TZ.MgCe5mAt9XKFYDQV5FCMKm6cpHhbVmTQArgicRUt7zzcWMhQ",
    client_secret: "256153260162134490",
    username: promptOptions.salesforce.username,
    password: promptOptions.salesforce.password + promptOptions.salesforce.key
  }

  var req = request.post(url).type("application/x-www-form-urlencoded").send(body)
  req.end(function(err,res){
    if(err) return deferred.reject(err)
    if(res.text.indexOf("error") > -1) return deferred.reject("Authentication Error. Check user, password and security token. " + res.text)
    tempVars.salesforce = JSON.parse(res.text)
    deferred.resolve(tempVars.salesforce)
  })

  return deferred.promise;
}

function publishPage(){
  var deferred = Q.defer();
  var name = promptOptions.app_name
  if(promptOptions.target == "localhost") name += "_dev"
  var url = tempVars.salesforce.instance_url + "/services/data/v29.0/sobjects/ApexPage/Name/" + name;
  
  body = {
    Markup : promptOptions.page,
    ControllerType : 3,
    MasterLabel: name,
    ApiVersion: "29.0"
  }
  
  var req = request.patch(url)
  .type("application/json")
  .set('Authorization', 'Bearer ' + tempVars.salesforce.access_token )
  .send(body)
  
  req.end(function(err,res){
    if(err) return deferred.reject(err)
    if( res.body[0] && res.body[0].errorCode ) return deferred.reject( "Salesforce.com rejected the upsert of a Visualforce Page with the HTML we send, it's posibly due to unvalid HTML. Please review your template files. ERROR: " + res.body[0].message )
    if( res.body.success == false || res.body.errorCode ) return deferred.reject( "ERROR: " + JSON.stringify( res.body ) )
    tempVars.pageResponse = res.body
    deferred.resolve(res.body)
  })

  return deferred.promise; 
}


function values( key ){
  var algorithm = 'aes-256-cbc';
  var inputEncoding = 'utf8';
  var outputEncoding = 'hex';
  var salt = promptOptions.public_dev_key + "_" + algorithm;

  var decipher = crypto.createDecipher(algorithm, salt);
  var deciphered = decipher.update(promptOptions.salesforce[key], outputEncoding, inputEncoding);
  deciphered += decipher.final(inputEncoding);

  promptOptions.salesforce[key] = deciphered

}

module.exports = execute;