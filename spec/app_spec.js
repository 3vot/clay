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

var App = require("../src/app")

var Path = require("path")

describe('3VOT App', function(){

  before(function remove(done){
    rimraf(  Path.join( process.cwd(), "3vot_cli_test", "apps", "silver" ) , function(err){
      done();
    })

    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );

  })
  

  it('should create an App', function(done){
    this.timeout(9000);
    var app = new App( { name: "silver" }  );
    app.createApp()
    .then( function(){ 
       try{ 
         var startSrc = fs.statSync( Path.join( process.cwd() , "apps", "silver" , "start" , "index.js"), "utf-8");
         var codeSrc = fs.statSync( Path.join( process.cwd() , "apps", "silver" , "code" , "index.js"), "utf-8");
         var layoutSrc = fs.statSync( Path.join( process.cwd() , "apps", "silver" , "templates" , "layout.html"), "utf-8");
         var headSrc = fs.statSync( Path.join( process.cwd() , "apps", "silver" , "templates" , "head.html"), "utf-8");

         var apps = fs.statSync( Path.join( process.cwd(), "apps", "silver" ,"app"));
         var assets = fs.statSync( Path.join( process.cwd(), "apps", "silver" ,"app", "assets"));


         var pck = require( Path.join( process.cwd(), "apps", "silver", "package.json"));
         pck.profile.should.equal("cli_test");
         pck.name.should.equal("silver");
         pck.version.should.equal("0.0.1");

         startSrc.isFile().should.equal(true);
         codeSrc.isFile().should.equal(true);
         layoutSrc.isFile().should.equal(true);
         headSrc.isFile().should.equal(true);

         apps.isDirectory().should.equal(true);
         assets.isDirectory().should.equal(true);

         done();
       }
       catch(err){
         console.error("Error in Test Spec");
         console.error(err);
       }
    })
    .fail( function(err){ console.error(err); } );
  });
});

