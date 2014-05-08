var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")
var Setup = require("../app/actions/profile_setup")
var Create = require("../app/actions/profile_create")
var Update = require("../app/actions/profile_update")
var StaticApp = require("../app/actions/app_create")
var Path= require("path")
var Stats = require("../app/utils/stats")
var Log = require("../app/utils/log")

function setup(callback){
  var options = [ 
    { name: 'key', description: 'Developer Key: ( use demo for testing )' },
    { name: 'email', description: 'Salesforce Username:' },
    { name: 'password', description: 'Salesforce Password:' , hidden: true },
    { name: 'token', description: 'Salesforce Security Token:' } ]
  ];
  
  prompt.start();
  prompt.get( options, function (err, result) {
    Setup(result)
    .then( function(){ Log.info("3VOT was currectly setup and it's ready to use.") } )
    .then( function(){ return Stats.track("site:setup", {kind: "new developer "}) } )
    .then( function(){ if(callback) return callback(); })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });
}

module.exports = {
  setup: setup,
  create: create,
  update: update
}