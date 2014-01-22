#!/usr/bin/env node

var argv = require('optimist').argv;
var Path = require('path')
var prompt = require("prompt")

var Q = require("q");
Q.longStackSupport = true;
var colors = require('colors');

var _3install = require("../3install")
var _3scaffold = require("../3scaffold")
var _3pm = require("../3pm")
var _3download = require("../3download")
var _3dev = require("../3dev")
var _3builder = require("../3builder")
var _3account = require("../3account")




// *****************
// CLI
// *****************


if( argv._.indexOf("account") > -1 && argv._.indexOf("register") > -1 ){
  /*
  prompt.start();
  
  prompt.get( [ 
    { name: 'name', description: 'Organization Name: ' },
    { name: 'name', description: 'Organization Name: ' },

    { name: 'username', description: 'Profile: ( pick your profile name ej: cocacola for 3vot.com/cocacola )', message: "Only lowercase letters, no spaces, dashes, etc", pattern: /[a-z]+/ }], function (err, result) {

    _3account.register( result )
    .then( function( profile ){ _3scaffold.setup({folder: "3vot-" + result.username, key: profile.public_dev_key, profile: result.username })  }  )
    
  });
 */
}

if( argv._.indexOf("setup") > -1 ){
  
  var folder = "";
  var key= "";
  var profile = "";
  
  prompt.start();
  
  prompt.get( [ 
    { name: 'profile', description: 'Profile Name: ( The Profile you want to build apps for )' },
    { name: 'key', description: 'Developer Key: ( Your Developer Key provided by the 3VOT Admin )' },
    { name: 'folder', description: 'Folder Name: ( The Folder where we will create the project )' } ], function (err, result) {
    
    _3scaffold.setup({folder: result.folder, key: result.key, profile: result.profile});
    
  });

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

