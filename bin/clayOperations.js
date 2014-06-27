var prompt = require("prompt")
var Setup = require("../app/actions/prepare")
var Dev = require("../app/actions/dev")
var Create = require("3vot-cloud/app/create")

var Send = require("../app/actions/send")
var Credentials = require("../app/salesforce/credentials")

var Path= require("path")
var Stats = require("3vot-cloud/utils/stats")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")
var colors = require('colors');



function create(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'user_name', description: 'Profile Name: ( only lowercase letters, numbers, and lowdash _ )' }, 
    { name: 'email', description: 'Email:' } ],
    function (err, result) {
      result.name = "";
      Log.setUsername(result.user_name)
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")
      Create(result)
      .then( function(promptOptions){
        Stats.register( result )
        Log.info("Clay created your profile and it's ready to use.")
        if(callback) return callback(result);
      })
    .fail( function(err){  Log.error(err, "./prompt/profile",43); });
  });
}

function prepare(callback, user_name, key){
  var options = [ 
    { name: 'email', description: 'Salesforce Username:' },
    { name: 'password', description: 'Salesforce Password:' , hidden: true },
    { name: 'token', description: 'Salesforce Security Token:' } ];

    if(!user_name && !key){
      options = [ 
        { name: 'user_name', description: 'Profile Name:' },
        { name: 'key', description: 'Developer Key:' }
      ].concat(options);
    }
  
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
  Log.setLevel("DEBUG2");

  var options = []
  if(cliOptions.app_name) options =  [{ name: 'password', description: 'Salesforce Password:' , hidden: true }]

  prompt.start();
  prompt.get( options, function (err, result) {
    result.app_name = cliOptions.app_name

    result = Packs._3vot(result);
    result.unmanned = cliOptions.unmanned
    Dev(result)
    .then(function(){ console.log("\n*** FIRST TIME? VISIT: https://localhost:3000/ and Accept Security Warning ***\n".yellow) })
    .then( function(){ return Stats.track("site:server") } )
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });
}

function upload( cliOptions ){
  var options = [ 
    { name: 'app_name', description: 'App: The name of the App' ,  },
    { name: 'password', description: 'Salesforce Password:' , hidden: true }
  ]

  prompt.start();
  prompt.get( options, function (err, result) {

    result = Packs._3vot(result);
    result.unmanned = cliOptions.unmanned
    Send(result)
    .then( function(){ return Stats.track("site:server") } )
    .then( function(){ console.log("Upload Successful") })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });
}

module.exports = {
  prepare: prepare,
  develop: develop,
  upload: upload,
  credentials: credentials,
  create: create
}