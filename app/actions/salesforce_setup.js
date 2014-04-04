var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')

var profileUpdate = require("./profile_update")

var salesforceProfile = require("./salesforce_profile")

var promptOptions = {
  public_dev_key: null,
  salesforce_user: null,
  password: null,
  key: null
}

var tempVars = {}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  
  values("salesforce_user")
  values("password")
  values("key")

  scaffold()
  .then (function(){ promptOptions.target = 'production'; return salesforceProfile( promptOptions ) })
  .then (function(){ return deferred.resolve() })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
  }

function scaffold(){
  console.log("Scaffolding Projects");
  var deferred = Q.defer();

  var _3votJSON = require( Path.join(  process.cwd(), "3vot.json" ));
  
  delete promptOptions.public_dev_key;
  _3votJSON.salesforce = {
    username: promptOptions.salesforce_user,
    password: promptOptions.password,
    key: promptOptions.key,
  }

  fs.writeFile( Path.join(process.cwd(), "3vot.json"), JSON.stringify(_3votJSON, null, '\t') , function(){ deferred.resolve()  } );

  return deferred.promise;
}


function values( key ){
  
  var algorithm = 'aes-256-cbc';
  var inputEncoding = 'utf8';
  var outputEncoding = 'hex';
  var salt = promptOptions.public_dev_key + "_" + algorithm;
  
  var cipher = crypto.createCipher(algorithm, salt);
  var ciphered = cipher.update(promptOptions[key], inputEncoding, outputEncoding);
  ciphered += cipher.final(outputEncoding);

  promptOptions[key] = ciphered

}

module.exports = execute;