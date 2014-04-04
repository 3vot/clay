var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")
var prompt = require("prompt")

var Profile = require("../models/profile")
var App = require("../models/app")

var AppInstall = require("./app_install")

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  app_name: null,
  size: null,
  static: null
}

var tempVars = {
  app: null,
  options: promptOptions
}

function execute(options){
    var deferred = Q.defer();

    promptOptions= options;
    
    tempVars.options = options;

    createApp()
    .then( scaffoldSwitch )
    .then( function(){ return AppInstall(promptOptions)  } )
    .then( deferred.resolve )
    .fail( function(err){ return deferred.reject(err); } );
    
    return deferred.promise;
  }


function createApp(){
  var deferred = Q.defer();
  
  callbacks={
    done: function(){
      tempVars.app = this;
      return deferred.resolve(this);
    },
    fail: function(error){   
      return deferred.reject( error )
    }
  }

  r = new RegExp(/^[a-z0-9-_]+$/)
  if( r.test( promptOptions.app_name ) == false ) {
    process.nextTick( function(){
      return deferred.reject( "App Name " + promptOptions.app_name + " is not valid, please use only Letter, Numbers and Hypens( - )" );
    })
  }

  App.create( { billing: { size: promptOptions.size }, name: promptOptions.app_name, public_dev_key: promptOptions.public_dev_key, user_name: promptOptions.user_name, marketing: { name: promptOptions.app_name } }, callbacks )
  
  return deferred.promise;
}

function scaffoldSwitch(){
  if(promptOptions.static) return scaffoldStatic;
  return scaffold;
}

function scaffold(){
  console.info("Scaffolding New App".grey);

  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "app" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "assets" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "app", "assets" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "code" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "start" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "templates" ));

  renderAndSave(Path.join( "app", "code.eco" ) , Path.join( "code" , "index.js" ), tempVars )
  
  renderAndSave(Path.join( "app", "desktop.eco" ) , Path.join( "start" , "desktop.js" ), tempVars )
  renderAndSave(Path.join( "app", "tablet.eco" ) , Path.join( "start" , "tablet.js" ), tempVars )
  renderAndSave(Path.join( "app", "phone.eco" ) , Path.join( "start" , "phone.js" ), tempVars )
  
  renderAndSave(Path.join( "app", "layout.eco" ) , Path.join( "templates" , "layout.html" ), tempVars )
  renderAndSave(Path.join( "app", "head.eco" ) , Path.join( "templates" , "head.html" ), tempVars )

  renderAndSave(Path.join( "app", "3vot.eco" ) , Path.join( "start", "3vot.js" ), tempVars )

  renderAndSave(Path.join( "app", "package.eco" ) , Path.join( "package.json" ), tempVars )


  return tempVars.app;
}

function scaffoldStatic(){
  console.info("Scaffolding New App".grey);

  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "app" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "assets" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "app", "assets" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "static" ));

  renderAndSave(Path.join( "app", "package.eco" ) , Path.join( "package.json" ), tempVars )

  return tempVars.app;
}

function renderAndSave(templatePath, destPath, tempVars){
  var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../../templates');
  templatePath = fs.readFileSync(  Path.join( templatesPath, templatePath ), "utf-8");
  
  var templateRender = eco.render( templatePath , tempVars);
  fs.writeFileSync( Path.join( process.cwd(), "apps", tempVars.app.name, destPath ), templateRender );
  
}


module.exports = execute;