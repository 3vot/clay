var http = require("http");
var Q = require("q");
var AWS = require("aws-sdk")

var credentials = {}

module.exports = credentials;


credentials.requestKeysFromProfile = function( profile ){
  var deferred = Q.defer();
  
  var req = http.get("http://backend.3vot.com/v1/tokens/developerToken?username=" + profile.get("username"), function(res){ 
    res.setEncoding('utf8');
    
    res.on("data" , function(data){ 
      var parsedData = JSON.parse(data);
      var config = credentials._config( parsedData )
      
      return deferred.resolve( profile ); 
    });
  });
  req.on("error", function(err){ return deferred.reject(err); })
  

return deferred.promise;

}

credentials._config = function( temporaryCredentials ){
  var calias = temporaryCredentials.Credentials;
  var cred = new AWS.Credentials( calias.AccessKeyId , calias.SecretAccessKey, calias.SessionToken );
  cred.expireTime = calias.Expiration;

  AWS.config.update( { credentials: cred }  );
  
  return cred;
  
}