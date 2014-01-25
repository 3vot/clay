var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")
var fs = require("fs")
var Aws = require("aws-sdk");


Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );
Aws.config.update( { accessKeyId: 'AKIAIHNBUFKPBA2LINFQ', secretAccessKey: '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' } );


var fs = require("fs")

var _3publish = require("../src/3publish")

var Path = require("path")

describe('3VOT Publish', function(){

  before(function doBefore(){
        process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );
  })
  
  it('should list all files in bucket', function(done){

    _3publish.listKeys("demo.3vot.com","tutorial/gold_0.0.72")
    .then( function(keys){ 
      keys.length.should.be.above(0)
      console.log("Test List Complete".green);
      done() 
    })
    .fail( function(err){ console.error(err); } );

  });

  it('should copy a file in bucket', function(done){

    _3publish.listKeys("demo.3vot.com","tutorial/gold_0.0.72")
    .then( function(keys){ 
      _3publish.copyKey("test.3vot.com", "demo.3vot.com/" +  keys[0].Key, "test.ok")
      .then( function(data){       console.log("Test Copy Complete".green); done(); }  )
      .fail( function(err){ console.log("error".red); console.error(err); })

    })
    .fail( function(err){ console.error(err.red); } );

  });
  
  it("should get an object", function(done){
    _3publish.getObjectFromBucket("test.3vot.com", "cli_test", "gold")
    .then( 
      function(body){ 
        console.log("Test Get Object Complete".green);
        done(); 
      }
    )
    .fail( function(){ console.log(arguments); })
  });
  
  
  it('should publish apps', function(done){
    this.timeout(10000);

    _3publish.publishApp("demo.3vot.com", "test.3vot.com", "gold", "0.0.56")
    .then( function(results){ 
      console.log("Test Publish Complete".green);
      done()
    })
    .fail( function(err){ console.error(err); } );

  });
  
});

