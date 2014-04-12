var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")
var Setup = require("../app/actions/profile_setup")
var Create = require("../app/actions/profile_create")
var Update = require("../app/actions/profile_update")
var StaticApp = require("../app/actions/app_create")
var Path= require("path")
var Stats = require("../app/utils/stats")
var Log = require("../app/utils/log")

function setup(callback){
  var options = [ 
    { name: 'public_dev_key', description: 'Developer Key: ( Your Developer Key provided by the 3VOT Admin )' } 
  ];
  
  prompt.start();
  prompt.get( options, function (err, result) {
    Setup(result)
    .then( function(){ Log.info("3VOT was currectly setup and it's ready to use.") } )
    .then( function(){ return Stats.track("site:setup", {kind: "new developer "}) } )
    .then( function(){ if(callback) return callback(); })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );
  });
}

function create(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'name', description: 'Name: ( The Official Name of your profile)' } ,
    { name: 'user_name', description: 'username: ( The username, that appears in the url )' }, 
    { name: 'email', description: 'email: ( Your Email, required in order to administer your profile )' }],
    function (err, result) {
      Log.setUsername(result.user_name)
      Log.info("We are creating your profile in the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")
      Create(result)
      .then( Setup )
      .then( Update )
      .then( function(promptOptions){
        var path = Path.join( process.cwd(), "3vot_" + promptOptions.user_name ) 
        Log.debug("Changing to path " + path , "prompts/profile", 39)
        process.chdir( path );
        promptOptions.size = "small"
        promptOptions.app_name = "site"
        promptOptions.static = true
        return StaticApp(promptOptions)
      })
      .then( function(){ 
        Stats.register( result )
        Log.info("3VOT created your profile and it's ready to use.")
        Log.info( ( "Now go to the project folder: cd 3vot_" + result.user_name ).bold )
        if(callback) return callback(result);
      })
    .fail( function(err){  Log.error(err, "./prompt/profile",43); });
  });
}

function update(callback){
  LoadPackage({})
  .then( function(){ return Stats.track("site:update", options ) } )
  .then( Update )
  .then( function(){ 
    Log.debug("Profile Updated Succesfully", "prompt/prompt", 54);
    if(callback) return callback({});
  })
  .fail( function(err){ Log.error(err, "prompt/profile",43); } );
}

module.exports = {
  setup: setup,
  create: create,
  update: update
}