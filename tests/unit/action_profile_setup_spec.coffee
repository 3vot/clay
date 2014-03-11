_3Model = require("3vot-model")
_3Model.Model.host = "http://localhost:3001/v1"
Setup = require("../app/actions/profile_setup")
Create = require("../app/actions/profile_create")
should = require("should")
nock = require("nock")
rimraf = require("rimraf");
Path = require("path");

describe '3VOT App', ->

  before (done) ->
    scope = nock("http://backend.3vot.com")
    .filteringPath(/username=[^&]*/g, 'username=XXX')
    .get('/v1/tokens/developerToken?username=XXX')
    .reply 200 , {Credentials: { AccessKeyId: "a" , SecretAccessKey: "b", SessionToken: "c" } }

    rimraf Path.join( process.cwd(), "3vot_cli_2_test" ) , (err) -> done()

  after () ->
    nock.cleanAll();

  it 'should execute setup action', (done) ->
    @timeout(100000);
    scope = nock('http://localhost:3001')
    .filteringPath (path) ->
      return "/v1/profiles"
    .get('/v1/profiles')
    .reply 200 , { id: 1, user_name: "cli_2_test", security: {public_dev_key: "0"} }

    Setup( key: "0")
    .fail (error) =>  
        error.should.equal(""); 
    .done ->
      done()

