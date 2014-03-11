_3Model = require("3vot-model")
_3Model.Model.host = "http://localhost:3002/v1"

Create = require("../../app/actions/app_create")

Upload = require("../../app/actions/app_upload")
should = require("should")
nock = require("nock")
Path = require("path");
rimraf = require("rimraf");

key = "9TLdINyv4Munqg2"

#nock.recorder.rec();


describe '3VOT App', ->

  before (done) ->
    projectPath = Path.join( process.cwd() , "3vot_cli_2_test" );
    console.info("Changing current directory to " + projectPath)
    process.chdir( projectPath );

    rimraf Path.join( process.cwd(), "apps", "cli_2_test_app_1"  ) , (err) -> 
      done()

  it 'should create a store', ( done ) ->
    Create( { app_name: "cli_2_test_app_1", user_name: "cli_2_test", public_dev_key: key, size: "small" } )
    .fail (error) ->
      error.should.equal("")
    .then =>
      done()
      
  it 'should upload an app', (done) ->
    @timeout(50000)

    Upload( { app_name: "cli_2_test_app_1", user_name: "cli_2_test", public_dev_key: key, size: "small" } )
    .fail (error) ->
      console.log(error.toString())
      error.should.equal("")
    .done (app) ->
      console.log(app.toString())
      done()