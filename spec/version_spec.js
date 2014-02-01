var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")
var fs = require("fs")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")

var Version = require("../src/version")

var Path = require("path")

describe('3VOT Version', function(){

  it('should upgrade the version', function(done){
    
    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );

    var pckPath = Path.join( process.cwd(), "apps", "gold", "package.json" );
    var pkg = require( pckPath );
    var versionParts = pkg.version.split(".");
    var version = versionParts[versionParts.length - 1 ];

    Version.upgradeVersion("gold")
    .then( function(){ 
      var pckPath = Path.join( process.cwd(), "apps", "gold", "package.json");
      var pkg = require(pckPath);
      pkg.version.should.equal("0.0." + (parseInt(version) + 1) );
      done() 
    })
    .fail( function(err){ console.error(err); } );

  });
});

