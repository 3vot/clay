var Path = require("path")
var fs = require("fs")
var Q = require("q");


var Log = require("3vot-cloud/utils/log")
var Encrypt = require('../salesforce/encrypt')

var profile = {};

var promptOptions = {
	email: null,
	password: null,
	token: null
}

function execute(options){
	var deferred = Q.defer();
	promptOptions = options;
	scaffold()
	.then (function(){ return deferred.resolve(promptOptions) })
	.fail( deferred.reject ) ;
	return deferred.promise;
}

function scaffold(){
  Log.debug("Scaffolding Projects", "actions/profile_setup", 52);
  var deferred = Q.defer();

    var _3votJSON = require(  Path.join( process.cwd(), "3vot.json" ));
    
    _3votJSON.salesforce = {
      user_name: Encrypt.hide(promptOptions.email, promptOptions.password),
      key: Encrypt.hide(promptOptions.token, promptOptions.password)
    }

    fs.writeFile( Path.join(process.cwd(), "3vot.json"), JSON.stringify(_3votJSON, null, '\t'), function(e){
      if(e) return deferred.reject(e);
      deferred.resolve();  
    });
    
  return deferred.promise;
}


module.exports = execute;