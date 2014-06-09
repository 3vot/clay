#!/usr/bin/env node

require("coffee-script/register")
var argv = require('optimist').argv;
var Path = require('path')
var prompt = require("prompt")
var fs = require("fs");
var Q = require("q");
var colors = require('colors');

var ClayOperations = require("./clayOperations")

var _3Model = require("3vot-model")

var Log = require("3vot-cloud/utils/log")
var Stat = require("3vot-cloud/utils/stats")

var App = require("./app")

Log.setLevel("INFO");

//_3Model.Model.host = "http://localhost:3002/v1"

_3Model.Model.host = "http://threevot-api.herokuapp.com/v1"

Log.debug("LOAD PACKAGE CAN INCLUDE OPTIONS TO LOAD 3VOT or APP PACKAGE AUTOMATICALLY AND DONT DO IT IN ACTIONS", "bin/cli", 36)
console.log("---- Clay by 3VOT ----")

// *****************
// CLI
// *****************
var callback = function(){
  Log.info("---- Clay by 3VOT ----")
}

if(argv.d){
  Log.setLevel("DEBUG2");
}

if(argv.l){
  _3Model.Model.host = "http://localhost:3002/v1"
}

if(argv.v){
  var pathToPackage =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../package.json');
  var pck  = require(pathToPackage);
  console.log(pck.version);
}
else if( argv.h ){
  var pkg = require("../package.json")
  var help = [
    "",
    "Usage: clay [options] [command]",
    "",
    "Commands:",
    "",
    "  setup                  Builds the project folder and installs all dependencies",
    "",
    "  create                 Creates a new javascript app for Salesforce.com ",
    "",
    "  server                 Create a development server. Local or inserted in Salesforce.",
    "",
    "  upload                 Uploads and publishes the app to your Salesforce account.",
    "",
    "  download               Downloads and app from a Profile",
    "",    
    "  build                  Builds the development version of the app (used in manual operations)",
    "",
    "  install                Installs the NPM and Bower dependencies of the app (used in manual operations)",
    "",
    
    "Utilities:",
    "",
    "  setup --c              Updates Salesforce Credentials. This can be used instead of setup, for update.",
    "",
    "  server --app appname   Runs a development server inserted in Salesforce. Appname is required. ",
    "",
    "  [command] -d             Runs the specified command in debug mode, showing all console outputs",
    "",
    "Options:",

    "  -h                     help information",
    "  -v                     output the version number",
    "  -d                     verbose",
    "  -unmanned              use an unmanned salesforce package"

  ].join("\n")
  console.log( help );
}
else{

  if( argv._.indexOf("register") > -1 ){ ClayOperations.create(); }


  else if( argv._.indexOf("setup") > -1 && argv.c){ ClayOperations.credentials(); }

  else if( argv._.indexOf("setup") > -1 ){ ClayOperations.prepare(); }

  else if( argv._.indexOf("server") > -1 ){ 
    var cliOptions = {};
    if(argv.app) cliOptions.app_name = argv.app
    if(argv.unmanned) cliOptions.unmanned = true

    ClayOperations.develop(cliOptions); 
  }

  else if( argv._.indexOf("upload") > -1 ){  ClayOperations.upload({ app: argv.app, unmanned: argv.unmanned } ); }
  
  else if( argv._.indexOf("download") > -1 ){ App.download(argv.app); }
  
  else if( argv._.indexOf("create") > -1 ){ App.template(argv.app); }
  else if( argv._.indexOf("install") > -1 ){ App.install(argv.app); }
  else if( argv._.indexOf("build") > -1 ){ App.build(argv.app); }



  else{    
    Log.info("Command not found: Use clay -h for help", "bin/3cli", 124)
  }
}
