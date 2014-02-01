var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")
var fs = require("fs")
var Aws = require("aws-sdk");


Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")

var Publish = require("../src/publish")

var Path = require("path")

describe('3VOT Publish', function(){

  before(function doBefore(){
    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );
  })
  
  it('should publish apps', function(done){
    this.timeout(10000);

    var publish = new Publish( {name: "gold", version: "0.0.72"}, { sourceBucket: "demo.3vot.com", destinationBucket: "3vot.com"} );
    publish.publishApp()
    .then( function(){ 
      console.log("Test Publish Complete".green);
      done();
    })
    .fail( function(err){ console.error(err); } );

  });
  
});