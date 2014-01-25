var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")
var _3store = require("../src/3store")

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

    _3store.createStore( "anyStore_3vot_123" )
    .then( function(store) { store.attributes.name.should.equal("anyStore_3vot_123");  done() } )
    .fail( function(err) { console.error(err); } );
    
  });
  
  it('should list all stores', function(done){

    this.timeout(10000);

    _3store.listStores()
    .then( 
      function(stores){ 
        stores.length.should.be.above(0);
        done();
      } 
    )
    .fail( function(err) { console.error(err); } );
    
  });
  
  it('should add and App to Store', function(done){

    this.timeout(10000);

    _3store.addAppToStore("test.3vot.com","anyStore_3vot_123", "gold", "0.0.40")
    .then( 
      function(){ 
        done();
      } 
    )
    .fail( function(err) { console.log("Error in addAppToStore".red); console.error(err); } );
    
  });
  
  it('should delete a store', function(done){
  
    this.timeout(10000);

    _3store.deleteStore( "anyStore_3vot_123" )
    .then( function() { done() } )
    .fail( function(err) { console.error(err); } );
    
  });
  
});