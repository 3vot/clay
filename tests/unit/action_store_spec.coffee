_3Model = require("3vot-model")
_3Model.Model.host = "http://localhost:3001/v1"

Create = require("../../app/actions/store_create")
Destroy = require("../../app/actions/store_destroy")

AddApp = require("../../app/actions/store_add_app")
RemoveApp = require("../../app/actions/store_remove_app")

List = require("../../app/actions/store_list")


should = require("should")
nock = require("nock")
rimraf = require("rimraf");
Path = require("path");

describe '3VOT App', ->

  before (done) ->
    done();

  after () ->
    nock.cleanAll();

  it 'should create a store', (done) ->
    scope2 = nock('http://localhost:3001')
    .filteringRequestBody (path) ->
      return '/v1/stores'
    .post('/v1/stores')
    .reply 200 , { id: 'b', name: "cli_2_test_store", apps: [] }


    Create( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: "0" } )
    .fail (error) =>  
      error.should.equal(""); 
    .done =>
      done()

  it 'should Destroy a store', (done) ->
  
    scope2 = nock('http://localhost:3001')
    .filteringPath (path) ->
      return "/v1/stores"
    .delete('/v1/stores')
    .reply 200 , { }


    Destroy( { name: "cli_2_test_store", user_name: "cli_2_test", public_dev_key: "0" } )
    .fail (error) =>  
      error.should.equal(""); 
    .done =>
      done()

  it 'should add an app to store', (done) ->
 

    scope2 = nock('http://localhost:3001')
    .filteringRequestBody (path) ->
      return "/v1/stores/actions/addAppToStore"
    .post("/v1/stores/actions/addAppToStore")
    .reply 200 , { id: 'b', name: "cli_2_test_store", apps: ["cli_2_test_store_app_1"] }


    AddApp( { name: "cli_2_test_store_app_1", user_name: "cli_2_test", public_dev_key: "0" , app: "cli_2_test_store_app_1" } )
    .fail (error) =>  
      error.should.equal(""); 
    .done =>
      done()
    
    
  it 'should remove an app from store', (done) ->
  
    scope2 = nock('http://localhost:3001')
    .filteringRequestBody (path) ->
      return "/v1/stores/actions/removeAppFromStore"
    .post("/v1/stores/actions/removeAppFromStore")
    .reply 200 , { id: 'b', name: "cli_2_test_store", apps: [] }


    RemoveApp( { name: "cli_2_test_store_app_1", user_name: "cli_2_test", public_dev_key: "0" , app: "cli_2_test_store_app_1" } )
    .fail (error) =>  
      error.should.equal(""); 
    .done =>
      done()
    
  it "should list all stores and apps", (done) ->

    scope2 = nock('http://localhost:3001')
    .filteringPath (path) ->
      return "/v1/stores/views/with_apps"
    .get("/v1/stores/views/with_apps")
    .reply 200 , [ { id: 'b', user_name: "cli_2_test", public_dev_key: "0", name: "cli_2_test_store", apps: ["cli_2_test_store_app_1"] } ]


    List( { user_name: "cli_2_test", public_dev_key: "0" } )
    .fail (error) =>  
      error.should.equal(""); 
    .done =>
      done()
    
      