_3Model = require("3vot-model")
_3Model.Model.host = "http://localhost:3001/v1"
Create = require("../app/actions/profile_create")
should = require("should")
nock = require("nock")
rimraf = require("rimraf");
Path = require("path");

describe '3VOT App', ->

  before (done) ->
    done();
    
  after () ->
    nock.cleanAll();

  it 'should create a profile setup action', (done) ->
    scope = nock('http://localhost:3001')
    .filteringRequestBody (path) ->
      return '/v1/profiles'
    .post('/v1/profiles')
    .reply 200 , { id: 'b', user_name: "cli_2_test", marketing: {name: "CLI Testing Procedures" }, security: {public_dev_key: "0"} }

    Create( { user_name: "cli_2_test", marketing: { name: "CLI Testing Procedures" } } )
    .fail (error) =>  
        error.should.equal(""); 
    .done ->
      done()