var Q = require("q");
var Profile = require("3vot-cloud/models/profile")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")
var extend = require('util')._extend

var promptOptions = {
  public_dev_key: null,
  users: null,
}

var tempVars = {
  profile: null
}

var oldUser = {};

module.exports = execute;

function execute(options){
  promptOptions = options;
  var deferred = Q.defer();

  oldUser = extend({},promptOptions.user);

  Packs.promptForUser(promptOptions)
  .then( removeuser )
  .then( deferred.resolve )
  .fail( deferred.reject )

  return deferred.promise;
}

function removeuser(object){
  delete oldUser.users[ promptOptions.user.user_name + ":" + object.user.salesforce_user_name + " : " + object.user.salesforce_host ];
  return Packs.set(oldUser, "clay");
}