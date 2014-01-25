var fs = require('fs');
var Ignore = require("fstream-ignore");
var Aws = require("aws-sdk");
var Semver = require("semver");
var fstream = require("fstream");
var tar = require("tar");
var zlib = require("zlib");
var Q = require("q");
Q.longStackSupport = true;
var colors = require('colors');
var Parse = require('parse').Parse;
var mime = require('mime')
var Path = require('path');

//TODO: Must request this variables in a Safe Way

// *****************
// CLI
// *****************
var _3profile;

_3profile = (function(){

  function _3profile() {}
  

  // Upload App Flow
  _3profile.getProfileFromKey = function( key ){
    var deferred = Q.defer();
    
    this.findProfileByKey(key)
    .then( this.getProfileFromParse )
    .then( function(profile){ return deferred.resolve(profile) } )
    .fail( function(error){ 
      console.error("Error Checking Profile".red)
      console.error(error);
      return deferred.reject();
    })
  
    return deferred.promise;
  
  }

  // **************
  // OOT Functions
  // ( do only one thing  )  
  // **************

  //
  // Parms: 
  // Returns: Promise
  // Desc: Users the Key in 3vot.json to get the username from the 3VOT Platform
  _3profile.findProfileByKey = function(){
    var config = require(Path.join( process.cwd(), "3vot.json") );
    var deferred = Q.defer();
    var Profiles = Parse.Object.extend("Profiles");
    var profileQuery = new Parse.Query(Profiles);
    profileQuery.equalTo("public_dev_key", config.key);
    console.info("Looking for Profile for key: xxxxxxxx located in 3vot.json".grey);
    return profileQuery.find();
  }

  //
  // Parms: Results from Query
  // Returns: Promise
  // Desc: Checks to see if the Key is valid, by listing the Profile associated with it.
  _3profile.getProfileFromParse = function(results){
    if(results.length === 0){
      return Q.fcall(function () {
        return new Error("We could not find a profile with the provided key. Check Configuration in 3vot.json".red);
      });
    } 
    console.info("Profile found!".grey);
    return results[0]; 
  }

  //

  return _3profile;
})();

module.exports = _3profile;