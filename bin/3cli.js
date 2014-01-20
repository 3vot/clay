#!/usr/bin/env node

var argv = require('optimist').argv;
var Path = require('path')

var Q = require("Q");
Q.longStackSupport = true;
var colors = require('colors');

var _3bower = require("../3bower")
var _3scaffold = require("../3scaffold")
var _3pm = require("../3pm")
var _3pmd = require("../3pmd")
var _3dev = require("../3dev")
var _3builder = require("../3builder")

// *****************
// CLI
// *****************

if( argv._.indexOf("setup") > -1 ){
  _3scaffold.setup({folder: argv.folder, key: argv.key, profile: argv.profile});
}

if( argv._.indexOf("install") > -1 ){
  var appPath = Path.join (process.cwd(), "apps", argv.app, "node_modules" )
  var pkg = Path.join(process.cwd(), "apps", argv.app, "package.json");
  
  var gitDeps = Object.keys( pkg.threevot.gitDependencies )
  
  _3bower.install( appPath, gitdeps );
}

if( argv._.indexOf("server") > -1 ){
  _3dev.startServer();
}

if( argv._.indexOf("upload") > -1 ){
  
  var __3pm = new _3pm( argv.app )
  __3pm.uploadApp();
}

if( argv._.indexOf("download") > -1 ){
  var __3pmd = new _3pmd( argv.app )
  __3pmd.downloadApp();
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

