var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var Update = require("../app/actions/app_update")
var Create = require("../app/actions/app_create")
var Download = require("../app/actions/app_download")
var Upload = require("../app/actions/app_upload")
var Build = require("../app/actions/app_build")
var Publish = require("../app/actions/app_publish")
var Install = require("../app/actions/app_install")

function create(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Create )
      .then( function(){ console.log("App Created Succesfully".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
  });
}

function update(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to update )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Update )
      .then( function(){ console.log("App Updated Succesfully".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
  });
}

function download(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_user_name', description: 'Profile: ( The profile name of the owner of the app )' }, 
    { name: 'app_name', description: 'App: ( The App you want to Download )' },
    { name: 'app_version', description: 'Version: ( The App version, hit enter for latest )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Download )
      .then( function(){ console.log("App Downloaded Succesfully".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ console.error(err); } )  
   });
}

function template(callback){
  prompt.start();
  prompt.get( [ { name: 'app_name', description: 'App: ( The App you want to Download )' } ], 
    function (err, result) {
      result.app_user_name = "template"
      LoadPackage(result)
      .then( Download )
      .then( function(){ console.log("App Downloaded Succesfully".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ console.error(err); } )  
   });
}

function publish(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App: ( The Name of the App you want to publish )' },
    { name: 'version', description: 'Version: ( The Version of the App you want to publish, enter for latest )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Publish )
      .then( function(){ console.log( "App Published Succesfully".green ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ console.log("Error Publishing App"); console.error(err); })
  });
}

function publishAsMain(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App: ( The Name of the App you want to publish )' },
    { name: 'version', description: 'Version: ( The Version of the App you want to publish, enter for latest )' } ], 
    function (err, result) {
      result.isMain = true;
      LoadPackage(result)
      .then( Publish )
      .then( function(){ console.log( "App Published Succesfully".green ) } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){ console.log("Error Publishing App"); console.error(err); })
  });
}

function upload(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App: ( the name of the app you want to upload  )' }], 
    function (err, result) {
    
    LoadPackage(result)
    .then( Upload )
    .then( function(){ console.log("App Upload Succesfull".green); } )
    .then( function(){ if(callback) return callback(); })
    .fail( function(err){ console.error(err); } )

  })
}

function install(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to install )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Install )
      .then( function(){ console.log("App Created Succesfully".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
  });
}


function build(callback){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' },
    { name: 'target', description: 'Build Target ( localhost, demo, production )' } ], 
    function (err, result) {
      Build(result.app_name, result.target)
      .then( function(){ console.log("App Created Succesfully".green); } )
      .then( function(){ if(callback) return callback(); })
      .fail( function(err){console.error(err); } )
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
  template: template
}
