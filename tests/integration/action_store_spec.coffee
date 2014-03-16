
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

describe '3VOT Store', ->

  before (done) ->
    projectPath = Path.join( process.cwd() , "3vot_cli_2_test" );
    console.info("Changing current directory in profile before to " + projectPath)
    process.chdir( projectPath );
    done()

  after () ->
    projectPath = Path.join( process.cwd(), ".." );
    console.info("Restoring current directory in profile after to");
    process.chdir( projectPath );

  it 'should create a store', (done) ->
    @timeout(20000)

    Create( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: process.env.public_dev_key } )
    .fail (error) =>  
      error.should.equal(""); 
    .done ->
      done()

  it 'should add an app to store', (done) ->
    @timeout(20000)

    AddApp( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: process.env.public_dev_key , app_name: "cli_2_test_app_1" } )
    .fail (error) =>  
      error.should.equal(""); 
    .done ->
      done()

  it "should list all stores and apps", (done) ->
    @timeout(20000)

    List( { user_name: "cli_2_test",  public_dev_key: process.env.public_dev_key } )
    .fail (error) =>  
        error.should.equal(""); 
    .done ->
      done()

  it 'should generate a store', (done) ->
    @timeout(20000)
    Generate( { user_name: "cli_2_test",  public_dev_key: process.env.public_dev_key } )
    .fail (error) =>
      error.should.equal(""); 
    .done ->
      done()

  it 'should remove an app from store', (done) ->
    @timeout(20000)

    RemoveApp( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: process.env.public_dev_key , app_name: "cli_2_test_app_1" } )
    .fail (error) =>  
      error.should.equal(""); 
    .done ->
      done()
    
  it 'should Destroy a store', (done) ->
    @timeout(20000)
    
    Destroy( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: process.env.public_dev_key } )
    .fail (error) =>  
      error.should.equal(""); 
    .done ->
      done()
