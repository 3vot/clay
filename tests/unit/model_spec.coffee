_3Model = require("3vot-model")

Profile = require("../app/models/profile")

_3Model.Model.host = "http://localhost:3000/v1"

describe '3VOT App', ->

  before (done) ->
    done();

  it "should query a profile with key", (done) ->

    query=
      select: Profile.query_key
      values: ["key"]

    Profile.queryProfile(0)
    .then(done)
    .fail( (error) ->  console.log(error); done())
      
  it 'should create an App', (done) ->

    onCreate= ->

    onError= () ->
      done()

    Profile.create
      user_name: "rra_delete",
      marketing: { name: "RRA" },
      security: {}
    , done: onCreate , fail: onError