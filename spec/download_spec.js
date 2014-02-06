var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")
var Download = require("../src/download")
var Install = require("../src/install")

var Path = require("path")

describe('3VOT Download', function(){
  
  it('should download and app and install dependencies', function(done){
    
    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );

    console.log("current path in download spec is " + process.cwd() );

    this.timeout(20500);

    var download =  new Download({ username: "cli_test", name: "gold" })
    download.downloadApp()
    .then( function(){ 
      var destinationDir = Path.join("3vot_cli_test", "apps", "gold", "node_modules" );
      return Install.install("gold", destinationDir) 
    })
    .then( function() { done() } )
    .fail( function(err) { console.error(err); err.should.equal(null); done() } );
    
  });
  
});