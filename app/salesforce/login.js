var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")
var encrypt = require('./encrypt')
var prompt = require("prompt")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")


var promptOptions = {
  password: null
}

var tempVars = {
  session: null,
  _3votJSON: null,
  salesforce: {
    user_name: null,
    key: null
  }
}



function execute(options){
  var deferred = Q.defer();
  promptOptions = options;


  login()
  .then( function(session){  deferred.resolve(session) } )
  .fail( deferred.reject );

  return deferred.promise;
}

function login(){
  Log.debug("Performing Login", "actions/salesforce/login", 109)
  Log.info("We are Loging in to Salesforce with your Credentials.")

  deferred = Q.defer();

  var url = "https://" + promptOptions.user.salesforce_host + "/services/oauth2/token";
  body = {
    grant_type: "password",
    client_id: "3MVG9A2kN3Bn17hvlSRXnnVzjDNILmhSt.TZ.MgCe5mAt9XKFYDQV5FCMKm6cpHhbVmTQArgicRUt7zzcWMhQ",
    client_secret: "256153260162134490",
    username: promptOptions.user.salesforce_user_name,
    password: promptOptions.user.salesforce_password + promptOptions.user.salesforce_token
  }


  var req = request.post(url).type("application/x-www-form-urlencoded").send(body)
  req.end(function(err,res){
    if(err) return deferred.reject(err)
    if(res.text.indexOf("error") > -1) return deferred.reject("Authentication Error. Check user, password and security token. " + res.text)
    Log.info("We did Logged in to Salesforce, ready.")

    var session = JSON.parse(res.text)
    return deferred.resolve(session)
  })


  return deferred.promise;
}

module.exports = execute;