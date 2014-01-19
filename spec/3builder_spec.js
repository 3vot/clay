var assert = require("assert")
var fs = require("fs")
var _3builder = require("../3builder")
var _3vot = require("3vot")

var Path = require("path")

describe('3Builder', function(){
  
  it('should build an app', function(done){
    _3builder.buildApp("gold")
    .then( function(contents){
      var file = fs.readFile( Path.join( process.cwd(), "apps", "gold", "app" , "index.js" ), function(err, contents){
        if(err) return console.error(err);
        done()
      });      
    })
    .fail( function(err){
      console.error(err);
    });
  });

  it('should build an dependency', function(done){
    _3builder.buildDependency("gold")
    .then( function(contents){
      var pck = require( Path.join( process.cwd(), "apps", "gold", "package.json" )  );
      var fileName = _3vot.getDependencyName( pck );
      var file = fs.readFile( Path.join( process.cwd(), "apps", "dependencies", fileName + ".js" ), function(err, contents){
        if(err) return console.error(err);
        done()
      });
      done()
    });
  });

});