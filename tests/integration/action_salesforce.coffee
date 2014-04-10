Setup = require("../../app/actions/salesforce_setup")

should = require("should")
nock = require("nock")
rimraf = require("rimraf");
Path = require("path");

sinon = require("sinon")

#nock.recorder.rec();

describe '3VOT Salesforce', ->

  before (done) ->
    projectPath = Path.join( process.cwd() , "3vot_cli_2_test" );
    console.info("Changing current directory in profile before to " + projectPath)
    process.chdir( projectPath );
    done()

  after () ->
    projectPath = Path.join( process.cwd(), ".." );
    console.info("Restoring current directory in profile after to");
    process.chdir( projectPath );

  it 'should setup salesforce', (done) ->
    @timeout(20000)

    server = sinon.fakeServer.create();

    Setup( { user_name: "cli_2_test", public_dev_key: process.env.public_dev_key, salesforce: { user_name: "one", password: "two", key: "thre" } } )
    .fail (error) =>  
      error.should.equal(""); 
    .done ->
      done()

    server.requests[0].respond(
        200,
        { "Content-Type": "application/json" },
        JSON.stringify([{ instance_url: "https://na99.salesforce.com", access_token: "abcdefg", id: "https://na15.salesforce.com/abcdefg/abcdeff" }])
    );


