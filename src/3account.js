var fs = require('fs');
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
var _3account;

_3account = (function(){

  var appName = "";
  var username = "";
  var packageInfo = "";
  var originalPackageInfo = "";
  var versionId = "";
  var appPackage;
  var stages = []

  function _3account() {
  }

  // Upload App Flow
  _3account.register = function( options ){

    var deferred = Q.defer();
    
    Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );
    
    var key  = "" +  parseInt(Math.random() * 1000000);
    this.createProfile(options.name, options.username, key)
    .then( function( profile ){ deferred.resolve(profile)  } )
    .fail( function(error){ 
      console.error("Error Registering Account".red)
      console.error(error);
      console.error("The last line contains Error Info".red.bold)
      deferred.reject( error );
    })
    
    return deferred.promise;
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Updates the Package Information in the 3VOT Platform
  _3account.createProfile= function( userDetails ){
    var deferred = Q.defer();
    
    stages.push["createProfile"]
    var Profiles = Parse.Object.extend("Profiles");
    profile = new Profiles()
    
    profile.set("name", userDetails.name);
    profile.set("username", userDetails.username);
    profile.set("public_dev_key", userDetails.key);
    
    profile.save(null, {
      success: function(profile){
        console.log(profile)
        deferred.resolve(profile);
      },
      error: function(profile, error){
        deferred.reject(error)
      },
    });
    
    return deferred.promise;
    
  }
  
 
  
  return _3account;
})();

module.exports = _3account;