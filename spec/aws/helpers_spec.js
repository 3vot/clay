var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")
var fs = require("fs")
var Aws = require("aws-sdk");


var AwsHelpers = require("./aws/helpers");

var fs = require("fs")


var Path = require("path")

describe('3VOT Publish', function(){

  before(function doBefore(){
        process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );
  })
  
  it('should list all files in bucket', function(done){
    var publish  = new Publish(  )
    
    AwsHelpers.listKeys()
    .then( function(keys){ 
      keys.length.should.be.above(0)
      console.log("Test List Complete".green);
      done() 
    })
    .fail( function(err){ console.error(err); } );

  });

  it('should copy a file in bucket', function(done){

    AwsHelpers.listKeys()
    .then( function(keys){ 
      Publish.copyKey("test.3vot.com", "demo.3vot.com/" +  keys[0].Key, "test.ok")
      .then( function(data){       console.log("Test Copy Complete".green); done(); }  )
      .fail( function(err){ console.log("error".red); console.error(err); })

    })
    .fail( function(err){ console.error(err.red); } );

  });
  
  it("should get an object", function(done){

    var publish - new Publish( {name: "gold", version: "0.0.72"}, { sourceBucket, "demo.3vot.com", destinationBucket: "3vot.com"} )
    
    "test.3vot.com", "cli_test", "gold"
    
    publish.getObjectFromBucket()
    .then( 
      function(body){ 
        console.log("Test Get Object Complete".green);
        done(); 
      }
    )
    .fail( function(){ console.log(arguments); })
  });
  
  
 
  
});

