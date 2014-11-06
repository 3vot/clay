var prompt = require("prompt")
var Packs = require("3vot-cloud/utils/packs")
var Download = require("3vot-cloud/app/download")
var Upload = require("3vot-cloud/app/upload")
var Build = require("3vot-cloud/app/build")
var Log = require("3vot-cloud/utils/log")
var Path = require("path")
var Stats = require("3vot-cloud/utils/stats")
var WalkDir = require("3vot-cloud/utils/walk")
var Transform = require("../app/utils/transform")
var Share = require("3vot-cloud/app/share")

var fs = require("fs")
var eco = require("eco")
var open = require("open");

var Mock = require("../app/actions/mock")

function share(ignoreSource){
  Packs._3vot({ namespace: "clay" })
  .then( function(res){ 
    result = res; 
    return Share(result); } )
  .then( function(app){ 
    return Stats.track("app:upload", result ) 
  })
  .then(function(){ process.exit() })
  .fail( function(err){ Log.error(err, "./prompt/app",123 ); });
}


function upload(ignoreSource){  
  Packs._3vot({ namespace: "clay" })
  .then( function(res){ 
    result = res; 
    result.transform = function(tempvars){
      transformToProduction(result,tempvars)
    }
    return Upload(result); } )
  .then( function(app){ 
    var url = "http://" + result.package.threevot.paths.productionBucket + "/" + result.user.user_name + "/" + result.package.name +  "_" + app.version
    Log.info("App Available at: " + url)
    open(url);
    return Stats.track("app:upload", result ) 
  })
  .then(function(){ process.exit() })
  .fail( function(err){ Log.error(err, "./prompt/app",123 ); });
}


function run(){
  Log.info("<:> CLAY DIGITAL CONTENT CLOUD :=)")
  Packs._3vot({}, false)
  .then( function(result){ return RunScript(result); } )
  .then( function(){ 
    Log.info("<:> CLAY SCRIPT COMPLETE :=)")
    return Stats.track("app:run" ) 
  })
  .then(function(){ process.exit() })
  .fail( function(err){  Log.error(err, "./bin/app", 18 ); });
}

function mock(){
  var prompts = [ { name: 'objectName', description: 'Salesforce Object: ( account, opportunity, contact, task )' } ];
    
  prompt.start();
  prompt.get(prompts, onResult);

  function onResult(err, result) {
      result.objectName = result.objectName.toLowerCase();
      result.namespace= "clay"
      

    Packs._3vot(result, false)
    .then( Mock )
    .then( function(){ return Stats.track("site:mock") } )
    .then( function(){ Log.info("Mocking Successful") })
    .fail( function(err){ Log.error(err, "./prompt/profile",43); } );  
  }
}

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
    result.namespace= "clay";
    Packs._3vot(result)
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
      result.app_user_name = "clay"
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
  create: create,
  run: run,
  mock: mock,
  upload: upload,
  share: share
}