var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")
var encrypt = require('3vot-cloud/salesforce/encrypt')
var prompt = require("prompt")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")


var promptOptions = {
  public_dev_key: null,
  salesforce: {
    user_name: null,
    password: null,
    key: null,
    session: null
  },
  target: "localhost",
  page: ""
}

var tempVars = {
  session: null,
  _3votJSON: null,
  originalJSON: {
    salesforce: {
      user_name: null,
      key: null,
    }
  }
}

function loadData(){
  if( !promptOptions.salesforce || !promptOptions.salesforce.user_name || !promptOptions.salesforce.key ){
    throw "Error: Please run salesforce:setup before any other Salesforce Command. Code: Session_Not_Found";
  }

  if(promptOptions.salesforce.password){
    promptOptions.salesforce.user_name = encrypt.show(promptOptions.salesforce.user_name, promptOptions.salesforce.password);
    promptOptions.salesforce.key = encrypt.show(promptOptions.salesforce.key, promptOptions.salesforce.password); 
    //FOR ENCODED SESSION promptOptions.salesforce.session = encrypt.show(promptOptions.salesforce.session, promptOptions.salesforce.password); 
  }

}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;

  loadData()
  .then(login)
  .then( deferred.resolve )
  .fail( deferred.reject );

  return deferred.promise;
}

function login(deferred){
  Log.debug("Performing Login", "actions/salesforce/login", 109)
  Log.info("We are Loging in to Salesforce with your Credentials.")
  
  deferred = deferred || Q.defer();

  var url = "https://login.salesforce.com/services/oauth2/token";
  body = {
    grant_type: "password",
    client_id: "3MVG9A2kN3Bn17hvlSRXnnVzjDNILmhSt.TZ.MgCe5mAt9XKFYDQV5FCMKm6cpHhbVmTQArgicRUt7zzcWMhQ",
    client_secret: "256153260162134490",
    username: promptOptions.salesforce.user_name,
    password: promptOptions.salesforce.password + promptOptions.salesforce.key
  }

  var req = request.post(url).type("application/x-www-form-urlencoded").send(body)
  req.end(function(err,res){
    if(err) return deferred.reject(err)
    if(res.text.indexOf("error") > -1) return deferred.reject("Authentication Error. Check user, password and security token. " + res.text)
    Log.info("We did Logged in to Salesforce, ready.")
    

		var session = JSON.parse(res.text)
    deferred.resolve(session)
  })

  return deferred.promise;
}

module.exports = execute;