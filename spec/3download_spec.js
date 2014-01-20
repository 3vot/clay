var should = require("should")
var fs = require("fs")
var _3download = require("../3download")

var Path = require("path")

describe('3Download', function(){
  
  it('should download an app', function(done){
    this.timeout(10500);
    
    var _3 =  new _3download({ username: "rodco", name: "gold" })
    _3.downloadApp()
    .then( function() { done() } )
    .fail( function(error) { error.should.equal(null); } );
  });

});