var Path = require("path")
var fs = require("fs")
var Q = require("q");

var profileUpdate = require("./profile_update")

var Profile = require("./salesforce_profile")

var Login = require('../salesforce/login')
var Encrypt = require('../salesforce/encrypt')

var Log = require("../utils/log")

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  salesforce: {
    user_name: null,
    password: null,
    key: null
  }
}

var tempVars = {}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  promptOptions.salesforce = promptOptions.saleforce_prompt
  delete promptOptions.saleforce_prompt
  
  
  scaffold()
  .then( Login )
  .then (function(){ return deferred.resolve() })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
  }

function scaffold(){
  Log.debug("Adding Salesforce Encrypted Values", "actions/salesforce_setup", 35)
  var deferred = Q.defer();

  var _3votJSON = require( Path.join(  process.cwd(), "3vot.json" ));
  
  _3votJSON.salesforce = {
    user_name: Encrypt.hide(promptOptions.salesforce.user_name, promptOptions.salesforce.password),
    key: Encrypt.hide(promptOptions.salesforce.key, promptOptions.salesforce.password)
  }

  promptOptions.salesforce.user_name = _3votJSON.salesforce.user_name;
  promptOptions.salesforce.key = _3votJSON.salesforce.key;

  fs.writeFile( Path.join(process.cwd(), "3vot.json"), JSON.stringify(_3votJSON, null, '\t') , 
    function(err){
      if(err) return deferred.reject(err)
      deferred.resolve(promptOptions)  
    }
  );

  return deferred.promise;
}

module.exports = execute;