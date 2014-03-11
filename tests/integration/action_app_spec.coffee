_3Model = require("3vot-model")
_3Model.Model.host = "http://localhost:3002/v1"

Upload = require("../../app/actions/app_upload")
Create = require("../../app/actions/app_create")

Download = require("../../app/actions/app_download")
Build = require("../../app/actions/app_build")

Publish = require("../../app/actions/app_publish")

should = require("should")
nock = require("nock")
rimraf = require("rimraf");
Path = require("path");

request = require("superagent")

key = "mdfxUOz49nG2ABz"

#nock.recorder.rec();

describe '3VOT App', ->

  before (done) ->
    projectPath = Path.join( process.cwd() , "3vot_cli_2_test" );
    console.info("Changing current directory to " + projectPath)
    process.chdir( projectPath );

    rimraf Path.join( process.cwd(), "apps", "cli_2_test_app_1"  ) , (err) -> 
      done()

  after () ->

  it 'should create an app', (done) ->
    Create( { app_name: "cli_2_test_app_1", user_name: "cli_2_test", public_dev_key: key, size: "small" } )
    .fail (error) ->
      error.should.equal("")
    .done (app) ->
      done()
      
  it 'should build an app', (done) ->
    @timeout(50000)
    Build( { app_name: "cli_2_test_app_1" } )
    .fail (error) ->
      console.log("error: " + error)
      error.should.equal("")
    .then (app) ->
      done()

  it 'should upload an app', (done) ->
    @timeout(50000)

    Upload( { app_name: "cli_2_test_app_1", user_name: "cli_2_test", public_dev_key: key, size: "small" } )
    .fail (error) ->
      error.should.equal("")
    .done (app) ->
      verifyUpload(app.version)
      
    verifyUpload= (version) ->
      url = "https://s3.amazonaws.com/source.3vot.com/cli_2_test/cli_2_test_app_1_" + version + ".3vot"
      request.get(url).end (err, res) ->
        if(err) then return err.should.equal("")
        done()
      
  it 'should download an app', (done) ->
    @timeout(50000)

    Download( { app_name: "cli_2_test_app_1", user_name: "cli_2_test", public_dev_key: key } )
    .fail (error) ->
      console.log(error.toString())
      error.should.equal("")
    .done (app) ->
      done()
  
  
  it 'should publish an app', (done) ->
    @timeout(50000)

    Publish( { app_name: "cli_2_test_app_1", user_name: "cli_2_test", public_dev_key: key } )
    .fail (error) ->
      throw error
      console.log(error.toString())
      error.should.equal("")
    .done (app) ->
      done()    
