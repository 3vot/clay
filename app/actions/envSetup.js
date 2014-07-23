var Path = require("path")
var fs = require("fs")
var Q = require("q");

var Profile = require("3vot-cloud/models/profile")

var AwsCredentials = require("3vot-cloud/aws/credentials");

var Log = require("3vot-cloud/utils/log")

var Packs = require("3vot-cloud/utils/packs")
var Install = require("3vot-cloud/utils/install")

var profile = {};

var promptOptions = {
  public_dev_key: null
}

var tempVars = {
  profile: null
}

function execute(options){
  var deferred = Q.defer();

  promptOptions = options;

  if(promptOptions.build == "y") promptOptions.build = true; else promptOptions.build = false;

  scaffold()
  .then( Install.installNPM )
  .then(function(){ return deferred.resolve(promptOptions) })
  .fail( function(err){ return deferred.reject(err) } );

  return deferred.promise;
}

function scaffold(){
    Log.debug("Scaffolding Projects", "actions/profile_setup", 52);
    var deferred = Q.defer();

    //fs.mkdirSync( Path.join( process.cwd(), "tmp" ));

    if(!promptOptions.package) promptOptions.package = createPackage(promptOptions.app_name);
    promptOptions.package.threevot = adjustPackage()

    fs.writeFile( Path.join(process.cwd(), "package.json"), JSON.stringify(promptOptions.package, null, '\t'), function(err){
      if(err) return deferred.reject(err);
      return deferred.resolve();
    });

    return deferred.promise;
}

function createPackage(app_name){
  return {
    "name": app_name,
    "description": "",
    "version": "0.0.1",
    "dependencies": {}
  }
}

function adjustPackage(){
  return {
    "version": "1",
    "instructions":"",
    "build": promptOptions.build || true,
    "distFolder": promptOptions.dist || "dist",
    "ignoreSource": true,
    "screens": {
      "0-320": "index",
      "320-900": "index",
      "900-1200": "index",
      "1200-5000": "index"
    },
    "extensions": [],
    "transforms": [],
    "external": {}
  }
}

module.exports = execute;