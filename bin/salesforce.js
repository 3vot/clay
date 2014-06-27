var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var AppUpload = require("../app/actions/app_upload")

var Setup = require("../app/actions/salesforce_setup")
var Upload = require("../app/actions/salesforce_upload")

var Log = require("../app/utils/log")
var Stats = require("../app/utils/stats")

var Packs = require("3vot-cloud/utils/packs")


function upload(callback){
  prompt.start();
  prompt.get( 
    [ { name: 'app_name', description: 'App Name: ( The name of the app you want to deploy to salesforce )' },
    { show_header: 'show_header', description: 'Show Header: Should the Visualforce Page have a header? (y/n)' }
    //FOR ENCODED SESSION,{ name: 'password', description: 'Salesforce Password:' , hidden: true },
     ],
    function (err, result) {
      result.target = "production"

      result = Packs._3vot(result);
      AppUpload(result)
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
      result = Packs._3vot(result);

      Upload(result)
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