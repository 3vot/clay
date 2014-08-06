var Q = require("q");
var Profile = require("3vot-cloud/models/profile")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")
var Login = require("../salesforce/login")

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
  
  callbacks = {
    done: function(profile){
      if(!profile.user_name) return deferred.reject("No User found with provided Key")
      Log.user_name = profile.user_name
      promptOptions.promptValues.user_name = profile.user_name;
      tempVars.profile = profile
      return deferred.resolve(profile);
    },
    fail: function(err){
      return deferred.reject(err);
    }
  }
  Profile.callView( "authenticate", { public_dev_key: promptOptions.promptValues.public_dev_key }, callbacks )
  
  return deferred.promise;
}

function saveuser(){
  if( !promptOptions.user ) promptOptions.user = { users: {} }
  else if( !promptOptions.user.users || promptOptions.user.users === undefined || promptOptions.user.users ===   "undefined") promptOptions.user.users = {};
  promptOptions.user.users[ promptOptions.promptValues.user_name + " : " + promptOptions.promptValues.salesforce_user_name + " : " + promptOptions.promptValues.salesforce_host ] = promptOptions.promptValues;
  return Packs.set(promptOptions.user, "clay");
}
