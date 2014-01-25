var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")
var _3profile = require("../src/3profile")

var Path = require("path")

describe('3VOT Profile', function(){
  
  it('should find a profile from key', function(done){
    
    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );

    this.timeout(20500);

    var config = require(Path.join( process.cwd(), "3vot.json") );

    _3profile.getProfileFromKey( config.key )
    .then( function(profile){ 
      profile.should.not.equal(null);
      done();
    });

  });
  
});