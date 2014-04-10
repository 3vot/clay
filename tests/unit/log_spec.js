var Log = require("../../app/utils/log")
var should = require("should")
var sinon = require("sinon")
var Q = require("q")

var spy = sinon.spy(console, 'log');

describe('3VOT Stats', function() {

  it("should set level", function() {
    
    Log.setLevel("DEBUG")
    Log.getLevel().should.equal(3)
    Log.setLevel("DEBUG2")
    
  });

  it("should log string error", function() {
    spy.withArgs("message")
    
    Log.error("message", "here", 22)

    spy.withArgs("message").calledOnce
  });


  it("should log json error", function() {
    var errorJson = '{"message": "Error Test Message "}';
    spy.withArgs(errorJson)
    
    Log.error(errorJson, "here", 44)

    spy.withArgs(errorJson).calledOnce
  });

  it("should log JS error", function() {
    var error = { message: "JS Error", lineNumber: 22, fileName: "filename", stack: "STACK ERROR: 123" }
    spy.withArgs(error)
    
    Log.error(error)

    spy.withArgs(error).calledOnce
  });

  it("should record an errpr JS error", function(done) {
    var error = { message: "JS Error", lineNumber: 22, fileName: "filename", stack: "STACK ERROR: 123" }
    Log.recordError(error, done)
  });

});