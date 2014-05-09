var prompt = require("prompt")
var LoadPackage = require("3vot-cloud/utils/package_loader")
var Setup = require("../app/actions/prepare")

var Path= require("path")
var Stats = require("3vot-cloud/utils/stats")
var Log = require("3vot-cloud/utils/log")




function prepare(callback){
  var options = [ 
    { name: 'key', description: 'Developer Key: ( use demo for testing )' },
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

module.exports = {
  prepare: prepare
}