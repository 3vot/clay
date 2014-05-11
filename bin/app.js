var prompt = require("prompt")
var LoadPackage = require("3vot-cloud/utils/package_loader")

var Create = require("3vot-cloud/app/create")
var Download = require("3vot-cloud/app/download")
var Upload = require("3vot-cloud/app/upload")
var Build = require("3vot-cloud/app/build")

var Install = require("3vot-cloud/app/install")
var Log = require("3vot-cloud/utils/log")

var Stats = require("3vot-cloud/utils/stats")


function static(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' } ], 
    function (err, result) {
      result.static = true;
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")
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
    { name: 'app_name', description: 'App Name: ( only lowercase letters and numbers )' } 
		], 
    function (err, result) {
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

      LoadPackage(result)
      .then( Create )
      .then( function(){ Log.info("OK. The App was created. To preview locally type: 3vot server "); } )
      .then( function(){ return Stats.track("app:create", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){  Log.error(err, "./prompt/app",41); });
  });
}

function download(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_user_name', description: 'Profile: ( The profile name of the owner of the app )' }, 
    { name: 'app_name', description: 'App: ( The App you want to Download )' },
    { name: 'app_version', description: 'Version: ( The App version, hit enter for latest )' } ], 
    function (err, result) {
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

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
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

      LoadPackage(result)
      .then( Download )
      .then( function(){ Log.info("OK. The App Template was downloaded. To preview locally type: 3vot server "); } )
      .then( function(){ return Stats.track("app:template", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){  Log.error(err, "./prompt/app", 82 ); });  
   });
}


function upload(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'password', description: 'Salesforce Password: ' },
], 
    function (err, result) {
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

    LoadPackage(result)
    .then( Upload )
    .then( function(){ Log.info("OK. The App was uploaded."); } )
    .then( function(){ return Stats.track("app:upload", result ) } )
    .then( function(){ if(callback) return callback(); })
    .fail( function(err){ Log.error(err, "./prompt/app",146 ); });

  })
}


function install(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to install )' } ], 
    function (err, result) {
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

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
      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

      Build(result.app_name, result.target)
      .then( function(){ Log.info("OK. The App was build for " + result.target ); } )
      .then( function(){ return Stats.track("app:build", result ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ Log.error(err, "./prompt/app",154 ); });
  });
}


module.exports = {
  create: create,
  upload: upload,
  download: download,
  build: build,
  install: install,
  template: template,
  static: static
}
