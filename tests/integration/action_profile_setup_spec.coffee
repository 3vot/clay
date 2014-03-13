Setup = require("../../app/actions/profile_setup")
Create = require("../../app/actions/profile_create")
should = require("should")
nock = require("nock")
rimraf = require("rimraf");
Path = require("path");

describe '3VOT Profile Setup', ->

  before (done) ->
    rimraf Path.join( process.cwd(), "3vot_cli_2_test" ) , (err) -> done()
 
  it 'should execute setup action', (done) ->
    @timeout(100000)
    Setup( public_dev_key: process.env.public_dev_key )
    .fail (error) =>
      throw error
      error.should.equal("");
    .done ->
      done()