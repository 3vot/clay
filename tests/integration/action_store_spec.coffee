_3Model = require("3vot-model")
_3Model.Model.host = "http://localhost:3002/v1"

Create = require("../../app/actions/store_create")
Destroy = require("../../app/actions/store_destroy")
AddApp = require("../../app/actions/store_add_app")


Generate = require("../../app/actions/store_generate_template")
RemoveApp = require("../../app/actions/store_remove_app")
List = require("../../app/actions/store_list")

should = require("should")
nock = require("nock")
rimraf = require("rimraf");
Path = require("path");

#nock.recorder.rec();

key = "mdfxUOz49nG2ABz"

describe '3VOT App', ->

  before (done) ->
    projectPath = Path.join( process.cwd() , "3vot_cli_2_test" );
    console.info("Changing current directory to " + projectPath)
    process.chdir( projectPath );
    done()

  it 'should create a store', (done) ->

    Create( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: key } )
    .fail (error) =>  
        error.should.equal(""); 
    .done ->
      done()

  it 'should add an app to store', (done) ->

    AddApp( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: key , app: "cli_2_test_app_1" } )
    .fail (error) =>  
        error.should.equal(""); 
    .done ->
      done()

  it 'should generate a store', (done) ->
    @timeout(20000)
    Generate( user_name: "cli_2_test", public_dev_key: "mdfxUOz49nG2ABz" )
    .fail (error) =>  
      throw error
      error.should.equal(""); 
    .done ->
      done()

  it "should list all stores and apps", (done) ->
    List( { user_name: "cli_2_test" } )
    .fail (error) =>  
        error.should.equal(""); 
    .done ->
      done()
    
    
  it 'should remove an app from store', (done) ->

    RemoveApp( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: key , app: "cli_2_test_app_1" } )
    .fail (error) =>  
        error.should.equal(""); 
    .done ->
          done()
    
  it 'should Destroy a store', (done) ->
    Destroy( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: key } )
    .fail (error) =>  
        error.should.equal(""); 
    .done ->
      done()
