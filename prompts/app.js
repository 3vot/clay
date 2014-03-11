var prompt = require("prompt")
var LoadPackage = require("../app/utils/package_loader")

var Create = require("../app/actions/app_create")
var Download = require("../app/actions/app_download")
var Upload = require("../app/actions/app_upload")
var Build = require("../app/actions/app_build")
var Publish = require("../app/actions/app_publish")
var Install = require("../app/actions/app_install")

function create(){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Create )
      .then( function(){ console.log("App Created Succesfully".green); } )
      .fail( function(err){console.error(err); } )
  });
}

function download(){
  prompt.start();
  prompt.get( [ 
    { name: 'user_name', description: 'Profile: ( The profile name of the owner of the app )' }, 
    { name: 'app_name', description: 'App: ( The App you want to Download )' },
    { name: 'app_version', description: 'Version: ( The App version, hit enter for latest )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Download )
      .then( function(){ console.log("App Downloades Succesfully".green); } )
      .fail( function(err){ console.error(err); } )  
   });
}

function publish(){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App: ( The Name of the App you want to publish )' },
    { name: 'version', description: 'Version: ( The Version of the App you want to publish, enter for latest )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Publish )
      .then( function(){ console.log("App Published Succesfully".green); } )
      .fail( function(err){ console.log("Error Publishing App"); console.error(err); })
  });
}

function upload(){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App: ( the name of the app you want to upload  )' }], 
    function (err, result) {
    
    LoadPackage(result)
    .then( Upload )
    .then( function(){ console.log("App Uploades Succesfully".green); } )
    .fail( function(err){ console.error(err); } )

  })
}

function install(){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Install )
      .then( function(){ console.log("App Created Succesfully".green); } )
      .fail( function(err){console.error(err); } )
  });
}


function build(){
  prompt.start();
  prompt.get( [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to create )' } ], 
    function (err, result) {
      LoadPackage(result)
      .then( Build )
      .then( function(){ console.log("App Created Succesfully".green); } )
      .fail( function(err){console.error(err); } )
  });
}


module.exports = {
  create: create,
  upload: upload,
  download: download,
  publish: publish,
  build: build,
  install: install
}
