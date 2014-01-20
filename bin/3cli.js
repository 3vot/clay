#!/usr/bin/env node

var argv = require('optimist').argv;
var Path = require('path')

var Q = require("Q");
Q.longStackSupport = true;
var colors = require('colors');

var _3install = require("../3install")
var _3scaffold = require("../3scaffold")
var _3pm = require("../3pm")
var _3download = require("../3download")
var _3dev = require("../3dev")
var _3builder = require("../3builder")

// *****************
// CLI
// *****************

if( argv._.indexOf("setup") > -1 ){
  _3scaffold.setup({folder: argv.folder, key: argv.key, profile: argv.profile});
}

if( argv._.indexOf("server") > -1 ){
  _3dev.startServer();
}

if( argv._.indexOf("upload") > -1 ){
  var pkg = Path.join(process.cwd(), "package.json");
  var __3pm = new _3pm( argv.app )
  __3pm.uploadApp();
}

if( argv._.indexOf("download") > -1 ){
  var __3download = new _3download( { username: argv.profile, name: argv.app } )
  __3download.downloadApp()
  .then( function(){ return _3install.install(argv.app) });
}

if( argv._.indexOf("build") > -1 ){

  if(argv.app){
    _3builder.buildApp( argv.app )
    .then( function(){ console.info("Build App Complete");  } )
    .fail( function(error){ console.error(error) } );
  }

  if(argv.dep){
    _3builder.buildDependency( argv.dep )
    .then( function(){ console.info("Build Depedency Complete");  } )
    .fail( function(error){ console.error(error) } );
  }

}

