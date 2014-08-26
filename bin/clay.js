#!/usr/bin/env node

require("coffee-script/register")
var argv = require('optimist').argv;
var Path = require('path')
var prompt = require("prompt")
var fs = require("fs");
var Q = require("q");
var colors = require('colors');

var _3Model = require("3vot-model")

var Log = require("3vot-cloud/utils/log")
var Stat = require("3vot-cloud/utils/stats")
var Packs =    require("3vot-cloud/utils/packs")

var App = require("./app")
var ClayOperations = require("./clayOperations")
var Users = require("./user")
var open = require("open")

Log.setLevel("INFO");

//_3Model.Model.host = "http://localhost:3002/v1"

_3Model.Model.host = "http://threevot-api.herokuapp.com/v1"

Stat.setup("53ac8179d97b856681000000","b58de1794216364dc655f61975b7879b20c2e201c815da5e493175dd2f74b9c92f3ad29b1480640fa6a27e89be0e534e9d204b56b55c50e26cd7cd86452947bdbb10c341913e2061e0396562e3c61215671396d6e73cea908f5591e332980b8ca873d463576f4921bb76a5e6fdd8856f")

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
    "  run                    Runs a predefined process for the current app, prompts to select from a list",
    "",
    "  mock                   Downloads Salesforce Mock Data",
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
    "  -d                     verbose"

  ].join("\n")
  console.log( help );
}
else{

  //if( argv._.indexOf("users") > -1 && argv.reset ){ require("./postInstall") }  

  if( argv._.indexOf("users") > -1  && argv.add ){ Users.addUser(); }  

  else if( argv._.indexOf("users") > -1  && argv.remove ){ Users.removeUser(); }  

  else if( argv._.indexOf("users") > -1 ){ Users.listUser(); }  

  else if( argv._.indexOf("register") > -1 ){ Users.register(); }

  else if( argv._.indexOf("setup") > -1 ){ ClayOperations.setup(); }

  else if( argv._.indexOf("server") > -1 ){  ClayOperations.develop(argv.offline); }

  else if( argv._.indexOf("offline") > -1 ){  require("../app/server"); open("https://localhost:3000/index.html") }
 
  else if( argv._.indexOf("upload") > -1 ){  ClayOperations.upload(); }
  
  else if( argv._.indexOf("download") > -1 ){ App.download(); }
  
  else if( argv._.indexOf("create") > -1 ){ App.create(); }

  else if( argv._.indexOf("share") > -1 ){ App.share(); }


  else if( argv._.indexOf("install") > -1 ){ App.install(); }

  else if( argv._.indexOf("build") > -1 ){ App.build(); }

  else if( argv._.indexOf("run") > -1 ){ App.run(); }

  else if( argv._.indexOf("mock") > -1 ){ App.mock(); }

  else if( argv._.indexOf("login") > -1 ){ ClayOperations.login(); }

  else if( argv._.indexOf("render") > -1 ){ ClayOperations.render(); }


  else{    
    Log.info("Command not found: Use clay -h for help", "bin/3cli", 124)
  }
}
