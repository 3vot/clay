var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')

var promptOptions = {
  public_dev_key: null,
  salesforce_user: null,
  password: null,
  key: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  
  values("salesforce_user")
  values("password")
  values("key")

  scaffold()
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
  var cipher = crypto.createCipher("aes192", promptOptions.public_dev_key + "_" + "aes192")
  cipher.update(promptOptions[key], "binary", "hex")
  promptOptions[key] = cipher.final("hex")
}

module.exports = execute;