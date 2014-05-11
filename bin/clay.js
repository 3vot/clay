#!/usr/bin/env node

require("coffee-script/register")
var argv = require('optimist').argv;
var Path = require('path')
var prompt = require("prompt")
var fs = require("fs");
var Q = require("q");
var colors = require('colors');

var Profile = require("./profile")

var _3Model = require("3vot-model")

var Log = require("3vot-cloud/utils/log")
var Stat = require("3vot-cloud/utils/stats")

var App = require("./app")

Log.setLevel("INFO");

//_3Model.Model.host = "http://localhost:3002/v1"

_3Model.Model.host = "http://threevot-api.herokuapp.com/v1"

Log.debug("LOAD PACKAGE CAN INCLUDE OPTIONS TO LOAD 3VOT or APP PACKAGE AUTOMATICALLY AND DONT DO IT IN ACTIONS", "bin/cli", 36)
console.log("-- CLAY by 3VOT Corporation --")

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
    "  prepare         Creates the project folder and installs all dependencies",
    "",
    "Utilities:",
    "",
    "   credentials    Updates Salesforce Credentials",
    "",
    "Options:",

    "  -d               run in debug mode, showing all console output",
    "  -h               help information",
    "  -v               output the version number"

  ].join("\n")
  console.log( help );
}
else{

  if( argv._.indexOf("create") > -1 ){ App.create(callback); }

  else if( argv._.indexOf("prepare") > -1 && argv.c){ Profile.credentials(); }

  else if( argv._.indexOf("prepare") > -1 ){ Profile.prepare(); }

  else if( argv._.indexOf("develop") > -1 ){ 
    var cliOptions = {};
    if(argv.app) cliOptions.app_name = argv.app
    Profile.develop(cliOptions); 
  }

  else{    
    Log.info("Command not found: Use clay -h for help", "bin/3cli", 124)
  }
}
