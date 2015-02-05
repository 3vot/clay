var Path    = require("path")
var fs      = require("fs");
var Q       = require("q");

var jsforce = require("jsforce");

function Login( username, password, host ){
  var deferred = Q.defer();
  
  var username = username;
  var password = password;
  var host = host || "login.salesforce.com"

  var conn = new jsforce.Connection({
    loginUrl : 'https://' + host
  });

  conn.login( username, password, function( err, userinfo ){
    if(err) deferred.reject(err)
    else{
      process.env.INSTANCE_URL = conn.instanceUrl;
      process.env.ACCESS_TOKEN = conn.accessToken;
      deferred.resolve(  )
    }
  });
  return deferred.promise; 
}

module.exports = Login;