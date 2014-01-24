var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")
var fs = require("fs")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")

var _3upload = require("../src/3upload")
var _3version = require("../src/3version")

var Path = require("path")

describe('3VOT Upload', function(){

  it('should upload an App', function(done){
    
    this.timeout( 90500 );
    
    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );
    
    var __3upload = new _3upload( "gold" )
    
    _3version.upgradeVersion("gold")
    .then( function(){ return __3upload.uploadApp(); } )
    .then( function(){ done() } )
    .fail( function(err){ err.should.equal(null); done() } )

  });
});