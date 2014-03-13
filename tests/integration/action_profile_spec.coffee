Create = require("../../app/actions/profile_create")

should = require("should")
nock = require("nock")
Path = require("path");

describe '3VOT Profile', ->

  #nock.recorder.rec();

  it 'should create a profile', (donefn) ->
    @timeout(20000)
    
    console.log("executing setup with key " + process.env.public_dev_key)
    
    
    res = Create( { user_name: "cli_2_test", marketing: { name: "CLI Testing Procedures" }, email: "rr@rr.com" } )

    res.fail (error) =>  
      okError = "Error: duplicate key value violates unique constraint \"profile_user_name_found\"";
      if JSON.parse(error).message == okError
        console.log("Warning: Profile Already Created")
        
        return donefn()
      return error.should.equal(""); 
    
    res.then (profile) ->
      process.env.public_dev_key = profile.security.public_dev_key
      donefn()