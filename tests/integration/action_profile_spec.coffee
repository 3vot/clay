_3Model = require("3vot-model")
_3Model.Model.host = "http://localhost:3002/v1"
Create = require("../../app/actions/profile_create")

should = require("should")
nock = require("nock")
Path = require("path");

describe '3VOT App', ->

  nock.recorder.rec();

  it 'should create a profile setup action', (done) ->
    Create( { user_name: "cli_2_test", marketing: { name: "CLI Testing Procedures" }, email: "rr@rr.com" } )
    .fail (error) =>  
      throw error
      error.should.equal(""); 
    .done ->
      done()
      
