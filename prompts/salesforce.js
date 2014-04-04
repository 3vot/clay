var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var AppUpload = require("../app/actions/app_upload")

var Setup = require("../app/actions/salesforce_setup")
var Upload = require("../app/actions/salesforce_upload")
var Profile = require("../app/actions/salesforce_profile")

function setup(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'salesforce_user', description: 'User Name: ( Salesforce Admin User )' } , 
    { name: 'password', description: 'Password:' , hidden: true } , 
    { name: 'key', description: 'Security Token ( info here: https://help.salesforce.com/HTViewHelpDoc?id=user_security_token.htm&language=en_US )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Setup )
      .then( function(){ console.log("Salesforce Setup Succesful".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
  });
}

function upload(callback){
  prompt.start();
  prompt.get( 
    [ { name: 'app_name', description: 'App Name: ( The name of the app you want to deploy to salesforce )' } ],
    function (err, result) {
      result.target = "production"
      LoadPackage(result)
      .then( AppUpload )
      .then( function(){ return Upload(result) } )
      .then( function(){ console.log("Salesforce Setup Succesful".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
    }
  );
}

function profile(callback){
  prompt.start();
  prompt.get( 
    [],
    function (err, result) {
      result.target = "production"
      LoadPackage(result)
      .then( Profile )
      .then( function(){ console.log("Salesforce Profile Uploaded".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
    }
  );
}

function dev(callback){
  prompt.start();
  prompt.get( 
    [ { name: 'app_name', description: 'App Name: ( The name of the app you want to develop on salesforce )' } ],
    function (err, result) {
      result.target = "localhost"
      LoadPackage(result)
      .then( Upload )
      .then( function(){ console.log("Salesforce Development App Published Succesful".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
    }
  );
}

module.exports = {
  setup: setup,
  upload: upload,
  dev: dev,
  profile: profile
}
