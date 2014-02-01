var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")
var fs = require("fs")
var AWS = require("aws-sdk")
var fs = require("fs")

var credentials = require("../../src/aws/credentials")

var Path = require("path")

describe('3VOT AWS', function(){

  it('should get Credentials', function(done){
    this.timeout(7000);
    credentials.requestKeysFromProfile( { get: function(attr){ return "bob123" } } )
    .then( function(config){ 
      var s3 = new AWS.S3();
      s3.listBuckets({}, function (err, data) {
        if (err) return console.log(err);
        done();
      });
    })
    .fail( function(err){ console.error(err); }   )
  
  });

});

