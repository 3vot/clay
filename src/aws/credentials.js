var request = require("superagent");
var Q = require("q");
var AWS = require("aws-sdk")

var credentials = {}

module.exports = credentials;


credentials.requestKeysFromProfile = function( profile ){
  var deferred = Q.defer();
  
  request.get("http://localhost:3001/v1/tokens/developerToken")
  .query({username: profile.get("username")})
  .on("error", function(err){ deferred.reject(err) })
  .end(function(res){
    var config = credentials._config( res.body )
    return deferred.resolve( profile ); 
  })

return deferred.promise;

}

credentials._config = function( temporaryCredentials ){
  var calias = temporaryCredentials.Credentials;
  var cred = new AWS.Credentials( calias.AccessKeyId , calias.SecretAccessKey, calias.SessionToken );
  cred.expireTime = calias.Expiration;

  AWS.config.update( { credentials: cred }  );
  
  return cred;
  
}