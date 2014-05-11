var prompt = require("prompt")
var LoadPackage = require("3vot-cloud/utils/package_loader")
var Setup = require("../app/actions/prepare")
var Dev = require("../app/actions/dev")


var Credentials = require("../app/salesforce/credentials")

var Path= require("path")
var Stats = require("3vot-cloud/utils/stats")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")



function prepare(callback){
  var options = [ 
    { name: 'user_name', description: 'Account Name:' },
    { name: 'key', description: 'Developer Key:' },
    { name: 'email', description: 'Salesforce Username:' },
    { name: 'password', description: 'Salesforce Password:' , hidden: true },
    { name: 'token', description: 'Salesforce Security Token:' } ];
  
  prompt.start();
  prompt.get( options, function (err, result) {
    Setup(result)
    .then( function(){ 
      console.log("-- CLAY by 3VOT --")
      Log.info("CLAY Project was currectly setup and it's ready to use.") 
    })
    .then( function(){ return Stats.track("site:setup", {kind: "new developer "}) } )
    .then( function(){ if(callback) return callback(); })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });
}

function credentials(callback){
  var options = [ 
    { name: 'email', description: 'Salesforce Username:' },
    { name: 'password', description: 'Salesforce Password:' , hidden: true },
    { name: 'token', description: 'Salesforce Security Token:' } ];
  
  prompt.start();
  prompt.get( options, function (err, result) {
    Credentials(result)
    .then( function(){ 
      console.log("-- CLAY by 3VOT --")
      Log.info("CLAY credentials updated succesfully.") 
    })
    .then( function(){ return Stats.track("site:credentials") } )
    .then( function(){ if(callback) return callback(); })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });
}


function develop( cliOptions ){
  var options = [ 
    { name: 'password', description: 'Salesforce Password:' , hidden: true }
  ]

  prompt.start();
  prompt.get( options, function (err, result) {
    result.app_name = cliOptions.app_name

    result = Packs._3vot(result);
    
    Dev(result)
    .then( function(){ return Stats.track("site:server") } )
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });
}


module.exports = {
  prepare: prepare,
  develop: develop
}