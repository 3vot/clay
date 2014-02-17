var assert = require("assert")
var should = require("should")
var Parse = require('parse').Parse;
var Path = require("path");
var rimraf = require("rimraf");
var http = require("http")
var fs = require("fs")

Parse.initialize( "IOcg1R4TxCDCPVsxAwLHkz8MPSOJfj2lZwdL4BU4", "jOr74Zy7C8VbatIvxoNyt2c03B9hPY7Hc32byA78" );

var fs = require("fs")

var Profile = require("../src/profile")

var ProfileModel = require("../src/model/profile")

var Path = require("path")

describe('3VOT Upload', function(){

  it('should create a profile', function(done){
    
    this.timeout( 90500 );
    
    Profile.create( { username: "eraseme", name: "erase if found" } )
    .then(function(profile) { profile.get("credits").small.should.equal(5); return profile;  } )
    .then( function(profile){ return ProfileModel.destroy(profile) } )
    .then( function(){ done() } )
    .fail( function(err){ console.log(err); err.should.equal(null); done() } )

  });
});