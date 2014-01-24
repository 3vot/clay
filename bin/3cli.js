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

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

// *****************
// CLI
// *****************

if(argv.v){
  var pathToPackage =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../package.json');
  var pck  = require(pathToPackage);
  console.log(pck.version);
}

else if( argv._.indexOf("version") > -1 ){
  prompt.start();
  prompt.get( [ 
    { name: 'app', description: 'App: ( The Application that you want to upgrade the version by 0.0.1 )' } ], function (err, result) {
      _3version.upgradeVersion( result.app )
      .then( function(){ console.log("Ok".green); } )
      .fail( function(err){ console.error(err.red); })
  });
}

else if( argv._.indexOf("setup") > -1 ){
  prompt.start();
  prompt.get( [ 
    { name: 'key', description: 'Developer Key: ( Your Developer Key provided by the 3VOT Admin )' } ], function (err, result) {
    _3setup.setup({ key: result.key });
  });
}

else if( argv._.indexOf("server") > -1 ){
  prompt.start();
  prompt.get( [ { name: 'domain', description: 'Domain: ( If you are on nitrous.io type the preview domain with out http:// or trailing slashes / ) ' }], 
   function (err, result) {
     _3dev.startServer( result.domain  ); 
   }
  );
}

else if( argv._.indexOf("upload") > -1 ){
  prompt.start();
  prompt.get( [ 
    { name: 'app', description: 'App: ( the name of the app you want to upload  )' }], function (err, result) {
    var pkg = Path.join(process.cwd(), "package.json");
    var __3upload = new _3upload( result.app )
    __3upload.uploadApp();   
  });
}

else if( argv._.indexOf("download") > -1 ){
  prompt.start();
  prompt.get( [ 
     { name: 'app', description: 'App: ( The App you want to download )' },
     { name: 'profile', description: 'Profile: ( The profile name of the owner of the app )' } ], function (err, result) {

     var __3download = new _3download( { username: result.profile, name: result.app } );
     __3download.downloadApp()
     .then( function(){ 
       var destinationDir = Path.join("3vot_cli_test", "apps", result.app, "node_modules" );
       return _3install.install(result.app, destinationDir) 
      });
   });
}
