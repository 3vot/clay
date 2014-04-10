var stat = require("../../app/utils/stats")
var Q = require("q")

describe('3VOT Stats', function() {

  before(function(done) {
    return done();
  });

  it("should track an event", function(done) {
    this.timeout(10000);
    stat.track("test event", { name: "the event name" })
    .then( function(){ done() } )    
    .fail( function(err){ console.log(err); } )
  });

  it("should register an user", function(done) {
    this.timeout(10000);
    stat.register({name: "the_test_user", user_name: "test_user", email: "one@3vot.com" })
    .then( function(){ done() } )    
    .fail( function(err){ console.log(err); } )
  });
  

});