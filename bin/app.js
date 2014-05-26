var prompt = require("prompt")
var LoadPackage = require("3vot-cloud/utils/package_loader")

var Download = require("3vot-cloud/app/download")
var Upload =   require("3vot-cloud/app/upload")
var Build =    require("3vot-cloud/app/build")
var Publish =  require("3vot-cloud/app/publish")
var Install =  require("3vot-cloud/app/install")
var Log =      require("3vot-cloud/utils/log")
var Stats =    require("3vot-cloud/utils/stats")

function promptOrResult( app_name, callback, prompts ){
 if(!prompts) prompts = []
 if(app_name && prompts.length == 0) return callback(null, { app_name: app_name });

  prompt.start();
  prompts.reverse();
  if(!app_name) prompts.push({ name: 'app_name', description: 'App Name ( The name of the app )' } )
  prompts.reverse();
  prompt.get(prompts , function(err, result){
    if(app_name) result.app_name = app_name;
    callback(err, result)
  });
}

function download(app_name){
  var prompts = [ 
    { name: 'app_user_name', description: 'Profile: ( The profile name of the owner of the app )' }, 
    { name: 'app_version', description: 'Version: ( The App version) *enter for latest )' },
    { name: 'app_new_name', description: 'Name: ( What you want to name your app ) *enter for same' },
  ]

  function onResult(err, result) {
    Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

    LoadPackage(result)
    .then( Download )
    .then( function(){ Log.info("OK. The App was downloaded. To preview locally type: 3vot server "); } )
    .then( function(){ return Stats.track("app:download", result ) } )
    .fail( function(err){  Log.error(err, "./prompt/app", 69 ); });
  };

  promptOrResult(app_name, onResult, prompts )
}

function template(app_name){
  
   var prompts = [ ];
  if(!app_name){
    prompts = [ { name: 'app_new_name', description: 'Name: ( What you want to name your app ) *enter for same' } ];
    app_name = "clay_multi_platform";
  }
  else{
    prompts = [ 
      { name: 'app_new_name', description: 'Name: ( What you want to name your app ) * Enter for 
      ' },
      { name: 'app_version', description: 'Version: ( The App version ) * Enter for latest )' }
    ]
  }

  function onResult(err, result) {
      result.app_user_name = "template"
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

      LoadPackage(result)
      .then( Download )
      .then( function(){ Log.info("OK. The App Template was downloaded. To preview locally type: 3vot server "); } )
      .then( function(){ return Stats.track("app:template", result ) } )
      .fail( function(err){  Log.error(err, "./prompt/app", 82 ); });  
   };

  promptOrResult(app_name, onResult, prompts )
}

function publish(app_name){
  var prompts = [ 
    { name: 'app_version', description: 'Version: ( The Version of the App you want to publish, enter for latest )' } ]

  function onResult(err, result) {
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

      LoadPackage(result)
      .then( Publish )
      .then( function(){ Log.info("OK. The App was published"); } )
      .then( function(){ return Stats.track("app:publish", result ) } )
      .fail( function(err){ Log.error(err, "./prompt/app",96 ); });
  };

  promptOrResult(app_name, onResult, prompts )
}

function publishAsMain(app_name){
  
  var prompts = [ 
    { name: 'version', description: 'Version: ( The Version of the App you want to publish, enter for latest )' } ];
    
  function onResult(err, result) {
    result.isMain = true;
    Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")
    
    LoadPackage(result)
    .then( Publish )
    .then( function(){ Log.info("OK. The App was published"); } )
    .then( function(){ return Stats.track("app:publish:main", result ) } )
    .fail( function(err){ Log.error(err, "./prompt/app",111 ); });
  };

  promptOrResult(app_name, onResult )
}

function upload(app_name){
  
  function onResult(err, result) {
    Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

    LoadPackage(result)
    .then( Upload )
    .then( function(){ Log.info("OK. The App was uploaded."); } )
    .then( function(){ return Stats.track("app:upload", result ) } )
    .fail( function(err){ Log.error(err, "./prompt/app",146 ); });
  }

  promptOrResult(app_name, onResult )
}


function install(app_name){

  function onResult(err, result) {
    Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

    LoadPackage(result)
    .then( Install )
    .then( function(){ Log.info("OK. The App was installed"); } )
    .then( function(){ return Stats.track("app:install", result ) } )
    .fail( function(err){ Log.error(err, "./prompt/app",140 ); });
  };

  promptOrResult(app_name, onResult )
}


function build(app_name){

  function onResult(err, result) {
    Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

    if(!result.target) result.target = "localhost"
    Build(result.app_name, result.target)
    .then( function(){ Log.info("OK. The App was build for " + result.target ); } )
    .then( function(){ return Stats.track("app:build", result ) } )
    .fail( function(err){ Log.error(err, "./prompt/app",154 ); });
  };

  promptOrResult(app_name, onResult )
}


module.exports = {
  upload: upload,
  download: download,
  publish: publish,
  build: build,
  install: install,
  publishAsMain: publishAsMain,
  template: template
}
