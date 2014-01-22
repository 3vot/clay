var fs = require('fs');
var Q = require("Q");
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

    Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );
    
    var key  = "" +  parseInt(Math.random() * 1000000);
    this.createProfile(options.name, options.username, key)
    .fail( function(error){ 
      console.error("Error Building + Uploading Package and/or App".red)
      console.error(error);
      console.error("The last line contains Error Info".red.bold)
      Q.fcall( this.undoUploadPackage )
      .then( this.undoUpdatePackageInfo )
      .then( function() {
        console.info("Recovered from Error correctly, please review info and try again. Let us know if you need any help.".green)
      })
      .fail(function(error){ 
        console.error(error);
        console.error("We could not undo the error, please notify Customer Support");
      });
    })
  }

  //
  // Parms: 
  // Returns: Promise
  // Desc: Updates the Package Information in the 3VOT Platform
  _3account.createProfile= function(name, username, key){
    var deferred = Q.defer();
    
    stages.push["createProfile"]
    var Profiles = Parse.Object.extend("Profiles");
    profile = new Profiles()
    
    profile.set("name", name);
    profile.set("username", username);
    profile.set("public_dev_key", key);
    
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