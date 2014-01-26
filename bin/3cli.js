#!/usr/bin/env node

var argv = require('optimist').argv;
var Path = require('path')
var prompt = require("prompt")
var fs = require("fs");
var Q = require("q");
Q.longStackSupport = true;
var colors = require('colors');
var Parse = require('parse').Parse;

var _3install = require("../src/3install")
var _3setup = require("../src/3setup")
var _3upload = require("../src/3upload")
var _3download = require("../src/3download")
var _3dev = require("../src/3dev")
var _3builder = require("../src/3builder")
var _3version = require("../src/3version")
var _3store = require("../src/3store")
var _3publish = require("../src/3publish")


Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

// *****************
// CLI
// *****************

if(argv.v){
  var pathToPackage =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../package.json');
  var pck  = require(pathToPackage);
  console.log(pck.version);
}

else if( argv._.indexOf("version") > -1 ){ _3version.prompt(); }

else if( argv._.indexOf("setup") > -1 ){ _3setup.prompt(); } 

else if( argv._.indexOf("server") > -1 ){ _3dev.prompt(); }

else if( argv._.indexOf("upload") > -1 ){ _3upload.prompt(); }

else if( argv._.indexOf("download") > -1 ){ _3download.prompt(); }

else if( argv._.indexOf("store") > -1 && argv._.indexOf("create") > -1 ){ _3store.promptCreate(); }

else if( argv._.indexOf("store") > -1 && argv._.indexOf("list") > -1 ){ _3store.listStores(); }

else if( argv._.indexOf("store") > -1 && argv._.indexOf("add") > -1 ){ _3store.promptAddToStore(); }

else if( argv._.indexOf("store") > -1 && argv._.indexOf("remove") > -1 ){ _3store.promptRemoveFromStore(); }

else if( argv._.indexOf("store") > -1 && argv._.indexOf("delete") > -1 ){ _3store.promptDelete(); }

else if( argv._.indexOf("publish") > -1 ){ _3publish.prompt(); }


