var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var AppUpload = require("../app/actions/app_upload")

var Setup = require("../app/actions/salesforce_setup")
var Upload = require("../app/actions/salesforce_upload")

var Log = require("../app/utils/log")
var Stats = require("../app/utils/stats")

function setup(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'user_name', description: 'User Name: ( Salesforce Admin User )' } , 
    { name: 'password', description: 'Password:' , hidden: true } , 
    { name: 'key', description: 'Security Token ( info here: https://help.salesforce.com/HTViewHelpDoc?id=user_security_token.htm&language=en_US )' } ], 
    function (err, result) {
      result.saleforce_prompt = {
        user_name: result.user_name,
        password: result.password,
        key: result.key
      }
      
      LoadPackage(result)
      .then( Setup )
      .then( function(){ Log.info("Salesforce Setup Succesfull, ok ready"); } )
      .then( function(){ return Stats.track("salesforce:setup", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "prompts/salesforce", 29 ) } )
  });
}

function upload(callback){
  prompt.start();
  prompt.get( 
    [ { name: 'app_name', description: 'App Name: ( The name of the app you want to deploy to salesforce )' },
    { show_header: 'show_header', description: 'Show Header: Should the Visualforce Page have a header? (y/n)' }
    //FOR ENCODED SESSION,{ name: 'password', description: 'Salesforce Password:' , hidden: true },
     ],
    function (err, result) {
      result.target = "production"
      LoadPackage(result)
      .then( AppUpload )
      .then( function(){ return Upload(result) } )
      .then( function(){ Log.info("Salesforce Setup Succesfull"); } )
      .then( function(){ return Stats.track("salesforce:upload", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "prompts/salesforce", 29 ) } )
    }
  );
}

function dev(callback){
  prompt.start();
  prompt.get( 
    [ { name: 'app_name', description: 'App Name: ( The name of the app you want to develop on salesforce )' } ,
    { show_header: 'show_header', description: 'Show Header: Should the Visualforce Page have a header? (y/n)' }
    //FOR ENCODED SESSION ,{ name: 'password', description: 'Salesforce Password:' , hidden: true },
     ],
    function (err, result) {
      result.target = "localhost"
      LoadPackage(result)
      .then( Upload )
      .then( function(){ Log.info( "Salesforce Development App Published Succesfully" ); } )
      .then( function(){ return Stats.track("salesforce:dev", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "prompts/salesforce", 29 ) } )
    }
  );
}

module.exports = {
  setup: setup,
  upload: upload,
  dev: dev,
  profile: profile,
  install: install
}