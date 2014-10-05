var prompt = require("prompt")
var Develop = require("../app/actions/develop")

var Deploy = require("../app/actions/deploy")

var Custom = require("../app/actions/custom")

var Login = require("../app/salesforce/login")

var Render = require("../app/salesforce/render")


var Path= require("path")
var Stats = require("3vot-cloud/utils/stats")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")
var colors = require('colors');

var EnvSetup = require("../app/actions/envSetup");

var open = require('open');

function setup(callback){
  var options = [ 
    { name: 'app_name', description: 'App Name: ( Give your app a unique name within your profile )' } ,
    { name: 'build', description: 'Use 3VOT Build Feature: ( y/n )' } ,
    { name: 'dist', description: 'Distribution Folder: ( hit enter for "dist"  )' } 
  ];
  
  prompt.start();
  prompt.get( options, function (err, result) {

    EnvSetup(result)
    .then( function(){ Log.info("3VOT was correctly setup and it's ready to use.") } )
    .then( function(){ return Stats.track("site:setup", {kind: "new developer "}) } )
    .then(function(){ process.exit() })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });
}

function develop( cliOptions ){
  Log.setLevel("DEBUG2");

  Packs.get({ namespace: "clay" })
  .then( Develop )
  .then(function(options){ open('https://localhost:3000/validate?app=' + options.url); })
  .then( function(){ return Stats.track("site:server") } )
  .fail( function(err){ Log.error(err, "./prompt/profile",43); } );

}

function upload(  ){
  Packs.get({ namespace: "clay" })
  .then( Deploy )
  .then( function(){ return Stats.track("site:server") } )
  .then( function(){ console.log("Upload Successful") })
  .fail( function(err){ Log.error(err, "./prompt/profile",43); } );

}

function custom(  ){
  Packs.get({ namespace: "clay" })
  .then( Custom )
  .then( function(){ return Stats.track("site:server") } )
  .then( function(){ console.log("Upload Successful") })
  .fail( function(err){ Log.error(err, "./prompt/profile",43); } );

}

function test(  ){
  Packs.get({ namespace: "clay" })
  .then( Test )
  .then( function(){ return Stats.track("site:server") } )
  .then( function(){ console.log("Upload Successful") })
  .fail( function(err){ Log.error(err, "./prompt/profile",43); } );

}

function login(  ){
  Packs.get({ namespace: "clay" })
  .then( Login )
  .then( function(){ return Stats.track("site:server") } )
  .then( function(){ console.log("Login Successful") })
  .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
}




module.exports = {
  setup: setup,
  develop: develop,
  upload: upload,
  login: login,
  custom: custom,

}