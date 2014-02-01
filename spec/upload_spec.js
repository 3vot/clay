var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")
var fs = require("fs")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")

var Upload = require("../src/upload")
var Vrsion = require("../src/version")

var Path = require("path")

describe('3VOT Upload', function(){

  it('should upload an App', function(done){
    
    this.timeout( 90500 );
    
    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );
    
    var upload = new Upload( "gold" )
    
    Version.upgradeVersion("gold")
    .then( function(){ return upload.uploadApp(); } )
    .then( function(){ done() } )
    .fail( function(err){ console.log(err); err.should.equal(null); done() } )

  });
});