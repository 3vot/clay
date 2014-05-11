Prepare = require("../app/actions/prepare")
should = require("should")
nock = require("nock")
rimraf = require("rimraf");
Path = require("path");

describe '3VOT Profile Setup', ->

  before (done) ->
    rimraf Path.join( process.cwd(), "clay_test" ) , (err) -> done()
 
  it 'should execute setup action', (done) ->
    @timeout(100000)
    Prepare( key: "key", user_name: "user_name" , email: "ok@ok.com", password: "pass", token: "1234"  )
    .fail (error) =>
      error.should.equal("");
    .done ->
      done()