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
var _3account = require("../src/3account")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

// *****************
// CLI
// *****************

if(argv.v){
  var pathToPackage =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../package.json');
  var pck  = require(pathToPackage);
  console.log(pck.version);
}

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
    { name: 'key', description: 'Developer Key: ( Your Developer Key provided by the 3VOT Admin )' } ], function (err, result) {
    
    _3setup.setup({ key: result.key });
    
  });

}

if( argv._.indexOf("server") > -1 ){
  
  prompt.start();
  
  prompt.get( [ 
     { name: 'domain', description: 'Domain: ( If you are on nitrous.io type the preview domain with out http:// or trailing slashes / ) ' }], function (err, result) {

      _3dev.startServer( result.domain  );
       
   });
  
  
}

if( argv._.indexOf("upload") > -1 ){
  
  prompt.start();
  
  prompt.get( [ 
     { name: 'app', description: 'App: ( the name of the app you want to upload  )' }], function (err, result) {

       var pkg = Path.join(process.cwd(), "package.json");
       var __3upload = new _3upload( result.app )
       __3upload.uploadApp();
       
   });

}

if( argv._.indexOf("download") > -1 ){
  
  prompt.start();
  
  prompt.get( [ 
     { name: 'app', description: 'App: ( The App you want to download )' },
     { name: 'profile', description: 'Profile: ( The profile name of the owner of the app )' } ], function (err, result) {

       var __3download = new _3download( { username: result.profile, name: result.app } )
       __3download.downloadApp()
       .then( function(){ return _3install.install(result.app) });
 
   });
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

