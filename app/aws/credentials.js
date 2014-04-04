var request = require("superagent");
var Q = require("q");
var AWS = require("aws-sdk")

var credentials = {}

module.exports = credentials;

credentials.requestKeysFromProfile = function( user_name ){
  var deferred = Q.defer();
  request.get("http://backend.3vot.com/v1/tokens/developerToken")
  .query( { username: user_name } )
  .on("error", function(err){ deferred.reject(err) })
  .end(function(res){
    var config = credentials._config( res.body )
    return deferred.resolve(); 
  })

return deferred.promise;

}

credentials._config = function( temporaryCredentials ){
  var calias = temporaryCredentials.Credentials;
  if( !temporaryCredentials.Credentials ) throw "Can't read AWS Temporary Credentials"
  var cred = new AWS.Credentials( calias.AccessKeyId , calias.SecretAccessKey, calias.SessionToken );
  cred.expireTime = calias.Expiration;

  AWS.config.update( { credentials: cred }  );
  
  return cred;
}