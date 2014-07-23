var prompt = require("prompt")
var Packs = require("3vot-cloud/utils/packs")
var Download = require("3vot-cloud/app/download")
var Upload = require("3vot-cloud/app/upload")
var Build = require("3vot-cloud/app/build")
var Install = require("3vot-cloud/app/install")
var Log = require("3vot-cloud/utils/log")
var Path = require("path")
var Stats = require("3vot-cloud/utils/stats")
var WalkDir = require("3vot-cloud/utils/walk")
var Transform = require("../app/utils/transform")
var fs = require("fs")
var eco = require("eco")

function download(){
  var prompts = [ 
    { name: 'app_name', description: 'App Name ( The name of the app you want to download)' },
    { name: 'app_user_name', description: 'Profile: ( The profile name of the owner of the app )' }, 
    { name: 'app_version', description: 'Version: ( The App version) hit enter for latest )' },
    { name: 'app_new_name', description: 'Name: ( What you want to name your app ) *enter for same' },
  ]

  prompt.get(prompts, onResult);

  function onResult(err, result) {
    Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")
    
    Packs._3vot(result, false)
    .then( function(res){ result = res; return Download(result); } )
    .then( function(){ Log.info("3. Preview with 'clay server'"); Log.info("ok"); } )
    .then( function(){ 
      return Stats.track("app:download", result ) 
    })
    .then(function(){ process.exit() })
    .fail( function(err){  Log.error(err, "./bin/app", 35 ); });
  };
}

function create(){
  var prompts = [ { name: 'app_new_name', description: 'Name: ( The name of your new app )' } ];
    
  prompt.start();
  prompt.get(prompts, onResult);

  function onResult(err, result) {
      result.app_user_name = "start"
      result.app_name = "blank";

      Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

      Packs._3vot(result, false)
      .then( function(res){ result = res; return Download(result); } )
      .then( function(){ Log.info("ok"); } )
      .then( function(){ return Stats.track("app:template", result ) } )
      .then(function(){ process.exit() })
      .fail( function(err){  Log.error(err, "./prompt/app", 82 ); });  
   };

}




function install(){

    Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")

    Packs._3vot( {}, false)
    .then( function(res){ result = res; return Install(result); } )
      .then( function(){ Log.info("ok"); } )
    .then( function(){ return Stats.track("app:install", result ) } )
    .then(function(){ process.exit() })
    .fail( function(err){ Log.error(err, "./prompt/app",140 ); });

}


function build(production){

    Log.info("<:> 3VOT DIGITAL CONTENT CLOUD :=)")
    var result = {}
    if(production) result.transform = function(tempvars){ transformToProduction(result,tempvars) }

    Packs._3vot(result, false)
    .then( function(res){ result = res; return Build(result); } )
      .then( function(){ Log.info("ok"); } )
    .then( function(){ return Stats.track("app:build", result ) } )
    .then(function(){ process.exit() })
    .fail( function(err){ Log.error(err, "./prompt/app",154 ); });

}

function transformToProduction( result, tempvars ){
  var apps = WalkDir( Path.join( process.cwd(), result.package.threevot.distFolder ) );
  if(tempvars && tempvars.app) result.version = tempvars.app.version;
  apps.forEach( function(path){
    var body = Transform.readByType(path.path, "production", result )
    fs.writeFileSync(path.path,body);
  });
}

module.exports = {
  download: download,
  build: build,
  install: install,
  create: create
}