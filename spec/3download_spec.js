var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")
var _3setup = require("../src/3setup")
var _3download = require("../src/3download")
var _3dev = require("../src/3dev")
var _3install = require("../src/3install")

var Path = require("path")

describe('3VOT Download', function(){
  
  it('should download and app and install dependencies', function(done){
    
    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );

    console.log("current path in download spec is " + process.cwd() );

    this.timeout(20500);

    var _3 =  new _3download({ username: "rodco", name: "gold" })
    _3.downloadApp()
    .then( function(){ 
      var destinationDir = Path.join("3vot_cli_test", "apps", "gold", "node_modules" );
      return _3install.install("gold", destinationDir) 
    })
    .then( function() { done() } )
    .fail( function(err) { console.error(err); } );
    
  });
  
});