#!/usr/bin/env node

var argv = require('optimist').argv;
var Path = require('path')
var prompt = require("prompt")
var fs = require("fs");
var Q = require("q");
var colors = require('colors');
var Parse = require('parse').Parse;

var Download = require("../src/download")
var Version = require("../src/version")
var Upload = require("../src/upload")
var Setup = require("../src/setup")
var Install = require("../src/install")

var Server = require("../src/server")
var Publish = require("../src/publish")


var Store = require("../src/store")
var App = require("../src/app")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

// *****************
// CLI
// *****************

if(argv.v){
  var pathToPackage =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../package.json');
  var pck  = require(pathToPackage);
  console.log(pck.version);
}

else if( argv._.indexOf("setup") > -1 ){ Setup.prompt(); } 

else if( argv._.indexOf("app:upload") > -1 ){ Upload.prompt(); }

else if( argv._.indexOf("app:clone") > -1 ){ Download.prompt(); }

else if( argv._.indexOf("app:version") > -1 ){ Version.prompt(); }

else if( argv._.indexOf("server") > -1 ){ Server.prompt(); }

else if( argv._.indexOf("store:create") > -1 ){ Store.promptCreate(); }

else if( argv._.indexOf("store:delete") > -1 ){ Store.promptDelete(); }

else if( argv._.indexOf("store:list") > -1 ){ Store.promptList(); }

else if( argv._.indexOf("store:add") > -1 ){ Store.promptAddToStore(); }

else if( argv._.indexOf("store:remove") > -1 ){ Store.promptRemoveFromStore(); }

else if( argv._.indexOf("app:publish") > -1 ){ Publish.prompt(); }

else if( argv._.indexOf("app:create") > -1 ){ App.promptCreate(); }

else if( argv._.indexOf("install") > -1 ){ Install.prompt(); }

