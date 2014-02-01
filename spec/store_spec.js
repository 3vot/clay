var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")
var Store = require("../src/store")

var Path = require("path")

describe('3VOT Store', function(){

  before( function runBefore( done ){
    this.timeout(20000);
    Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

    process.chdir( Path.join( process.cwd(), "3vot_cli_test" ) );
    done()
  });
  
  
  it('should create a store', function(done){
  
    this.timeout(10000);

    Store.createStore( {name: "anyStore_3vot_123" } )
    .then( function() {  done() } )
    .fail( function(err) { console.error(err); } );
    
  });
  
  it('should list all stores', function(done){

    this.timeout(10000);

    Store.listStores( {} )
    .then( function(){ done(); } 
    )
    .fail( function(err) { console.error(err); } );
    
  });

  it('should add and App to Store', function(done){

    this.timeout(20000);
    Store.destinationBucket = "test.3vot.com"

    Store.addAppToStore( { name: "anyStore_3vot_123", appName: "gold" } )
    .then( 
      function(){ 
        done();
      } 
    )
    .fail( function(err) { console.log("Error in addAppToStore".red); console.error(err); } );
    
  });
  
  it('should delete an app from store', function(done){
  
    this.timeout(20000);
    Store.destinationBucket = "test.3vot.com"

    Store.removeAppFromStore( { name: "anyStore_3vot_123", appName: "gold" } )
    .then( 
      function(){ 
        done();
      } 
    )
    .fail( function(err) { console.log("Error in addAppToStore".red); console.error(err); } );
    
  });
  
  it('should delete a store', function(done){
  
    this.timeout(10000);

    Store.destroyStore( {name: "anyStore_3vot_123" } )
    .then( function() {  done() } )
    .fail( function(err) { console.error(err); } );
    
  });

});