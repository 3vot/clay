var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")
var encrypt = require('../salesforce/encrypt')
var prompt = require("prompt")
var Log = require("../utils/log")
var Packs = require("../utils/packs")


var promptOptions = {
  public_dev_key: null,
  user_name: null,
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

  testSession()
  .then( deferred.resolve )
  .fail( deferred.reject );

  return deferred.promise;
}

function passwordPresentSwitch(deferred){
 if(!promptOptions.password){
    Log.debug("Session not available, password either. Request Password", "actions/salesforce/login", 58)        
    return requestPassword(deferred);
  }
  else{
    Log.debug("Session not available, we have password. We'll login", "actions/salesforce/login", 63)
    return login(deferred);
  }
}

function testSession(){
  Log.debug("Testing Session", "actions/salesforce/login", 56)
  var deferred = Q.defer();
  
  if(!promptOptions.salesforce.session){
    return passwordPresentSwitch()
  }
  
  Log.info("We are testing your active session to see if it's still valid", "actions/salesforce/login", 63)
  
  var url = promptOptions.salesforce.session.id
  
  Log.info("Salesforce Test Endpoint: " + url, "actions/salesforce/login", 67)

  var req = request.get(url)
  .set('Authorization', 'Bearer ' + promptOptions.salesforce.session.access_token )
  .send()
  
  req.end(function(err,res){
    if(err){
       return passwordPresentSwitch(deferred)
    }
    else{
      if(res.status > 300) return passwordPresentSwitch(deferred)
      Log.debug("Session Success, still valid", "actions/salesforce/login", 86)
      return deferred.resolve()
    }
  })
  
  return deferred.promise;
}

function requestPassword(deferred){
  Log.debug("Requesting Password", "actions/salesforce/login", 88)
  Log.info("Please type your salesforce password to refresh your session.", "actions/salesforce/login", 63)
  
  deferred = deferred || Q.defer();
  
  prompt.start();
  prompt.get( [ 
    { name: 'password', description: 'Password:' , hidden: true } ], 
    function (err, result) {
      if(err) return deferred.reject(err)
      promptOptions.salesforce.password = result.password;
      loadData()
      return login(deferred);
    }
  );
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
    
    tempVars.session = JSON.parse(res.text)
    return saveSession(deferred)
  })

  return deferred.promise;
}

function saveSession(deferred){
    Log.debug("Saving Session", "salesforce/login", 152)
    var _3votJSON = Packs._3vot(true)
        
    //FOR ENCODED SESSION _3votJSON.salesforce.session= encrypt.show(tempVars.session, promptOptions.salesforce.password);
    _3votJSON.salesforce.session = tempVars.session;
    
    Packs._3vot.save(_3votJSON)
    .then( deferred.resolve )
    .fail( deferred.reject )
}


module.exports = execute;