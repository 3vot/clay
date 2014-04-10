var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var Update = require("../app/actions/app_update")
var Create = require("../app/actions/app_create")
var Download = require("../app/actions/app_download")
var Upload = require("../app/actions/app_upload")
var Build = require("../app/actions/app_build")
var Publish = require("../app/actions/app_publish")
var Install = require("../app/actions/app_install")
var Log = require("../app/utils/log")

var Stats = require("../app/utils/stats")


function static(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' } ], 
    function (err, result) {
      result.static = true;
      Log.info("We are creating your app in the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")
      LoadPackage(result)
      .then( Create )
      .then( function(){ Log.info("OK. The App was created. To preview locally type: 3vot server "); } )
      .then( function(){ return Stats.track("app:static", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){  Log.error(err, "./prompt/app",27); });  
    }
  );
}

function create(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' } ], 
    function (err, result) {
      Log.info("We are creating your app in the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")

      LoadPackage(result)
      .then( Create )
      .then( function(){ Log.info("OK. The App was created. To preview locally type: 3vot server "); } )
      .then( function(){ return Stats.track("app:create", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){  Log.error(err, "./prompt/app",41); });
  });
}

function update(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to update )' } ], 
    function (err, result) {
      Log.info("We are updating your app in the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")

      LoadPackage(result)
      .then( Update )
      .then( function(){ Log.info("OK. The App's Details was update'"); } )
      .then( function(){ return Stats.track("app:update", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){  Log.error(err, "./prompt/app", 54); });
  });
}

function download(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_user_name', description: 'Profile: ( The profile name of the owner of the app )' }, 
    { name: 'app_name', description: 'App: ( The App you want to Download )' },
    { name: 'app_version', description: 'Version: ( The App version, hit enter for latest )' } ], 
    function (err, result) {
      Log.info("We are downloading your app from the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")

      LoadPackage(result)
      .then( Download )
      .then( function(){ Log.info("OK. The App was downloaded. To preview locally type: 3vot server "); } )
      .then( function(){ return Stats.track("app:download", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){  Log.error(err, "./prompt/app", 69 ); });  
   });
}

function template(callback){
  prompt.start();
  prompt.get( [ { name: 'app_name', description: 'App: ( The App you want to Download )' } ], 
    function (err, result) {
      result.app_user_name = "template"
      Log.info("We are downloading your app template from the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")

      LoadPackage(result)
      .then( Download )
      .then( function(){ Log.info("OK. The App Template was downloaded. To preview locally type: 3vot server "); } )
      .then( function(){ return Stats.track("app:template", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){  Log.error(err, "./prompt/app", 82 ); });  
   });
}

function publish(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App: ( The Name of the App you want to publish )' },
    { name: 'app_version', description: 'Version: ( The Version of the App you want to publish, enter for latest )' } ], 
    function (err, result) {
      Log.info("We are publishing your app to the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")

      LoadPackage(result)
      .then( Publish )
      .then( function(){ Log.info("OK. The App was published"); } )
      .then( function(){ return Stats.track("app:publish", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "./prompt/app",96 ); });
  });
}

function publishAsMain(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App: ( The Name of the App you want to publish )' },
    { name: 'version', description: 'Version: ( The Version of the App you want to publish, enter for latest )' } ], 
    function (err, result) {
      result.isMain = true;
      Log.info("We are publishing your app as the main site to the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")
      
      LoadPackage(result)
      .then( Publish )
      .then( function(){ Log.info("OK. The App was published"); } )
      .then( function(){ return Stats.track("app:publish:main", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "./prompt/app",111 ); });
  });
}

function upload(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App: ( the name of the app you want to upload  )' }], 
    function (err, result) {
    Log.info("We are uploading your app to the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")

    LoadPackage(result)
    .then( Upload )
    .then( function(){ Log.info("OK. The App was uploaded."); } )
      .then( function(){ return Stats.track("app:upload", result ) } )
    .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "./prompt/app",125 ); });

  })
}


function install(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to install )' } ], 
    function (err, result) {
      Log.info("We are installing your app's dependencies from the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")

      LoadPackage(result)
      .then( Install )
      .then( function(){ Log.info("OK. The App was installed"); } )
      .then( function(){ return Stats.track("app:install", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "./prompt/app",140 ); });
  });
}


function build(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' },
    { name: 'target', description: 'Build Target ( localhost, demo, production )' } ], 
    function (err, result) {
      Log.info("We are building your app in the 3VOT Platform, it may take a minute... We'll keep you informed of how it goes...")

      Build(result.app_name, result.target)
      .then( function(){ Log.info("OK. The App was build for " + result.target ); } )
      .then( function(){ return Stats.track("app:build", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "./prompt/app",154 ); });
  });
}


module.exports = {
  create: create,
  update: update,
  upload: upload,
  download: download,
  publish: publish,
  build: build,
  install: install,
  publishAsMain: publishAsMain,
  template: template,
  static: static
}
