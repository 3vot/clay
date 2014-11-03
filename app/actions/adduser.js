var Q = require("q");
var Profile = require("3vot-cloud/models/profile")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")
var Login = require("../salesforce/login")
var Request = require("superagent")


promptOptions = {
  public_dev_key: null,
  users: null,
}

tempVars = {
  profile: null
}

module.exports = execute;

function execute(options){
  promptOptions = options;
  var deferred = Q.defer();


  getProfile()
  .then(function(){ var testPrompts = {user: promptOptions.promptValues}; return Login(testPrompts) } )  
  .then(function(){ return saveuser() } )
  .then( deferred.resolve )
  .fail( deferred.reject )

  return deferred.promise;
}

function getProfile(){
  var deferred = Q.defer();
  
  callbacks= function(res){
    if (res.ok && responseOk(res.body) ) {
      res.body = JSON.parse(res.body)
      if(!res.body.Name) return deferred.reject("No User found with provided Key")
      Log.user_name = res.body.user_name
      promptOptions.promptValues.user_name = res.body.Org__r.Name;
      tempVars.profile = res.body;
      return deferred.resolve( tempVars.profile ) ;
    } else {
      Log.debug(res.text, "addUser", 45);
      Log.warning("It seems the access code you provided is not correct.")
      return deferred.reject( res.error || res.body )
    }
  }

  Request.get(promptOptions.package.threevot.api)
  .set('Accept', 'application/json')
  .type("application/json")
  .query("dev_code=" + promptOptions.promptValues.public_dev_key)
  .end(callbacks);

  return deferred.promise;
}


function saveuser(){
  if( !promptOptions.user ) promptOptions.user = { users: {} }
  else if( !promptOptions.user.users || promptOptions.user.users === undefined || promptOptions.user.users ===   "undefined") promptOptions.user.users = {};
  promptOptions.user.users[ promptOptions.promptValues.user_name + " : " + promptOptions.promptValues.salesforce_user_name + " : " + promptOptions.promptValues.salesforce_host ] = promptOptions.promptValues;
  return Packs.set(promptOptions.user, "clay");
}

function responseOk(responseBody){
  if(responseBody.indexOf("ERROR_CODE") > -1) return false
  return true;
}