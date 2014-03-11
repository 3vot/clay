var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")
var prompt = require("prompt")

var Profile = require("../models/profile")
var App = require("../models/app")

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  app_name: null,
  size: null
}

var tempVars = {
  app: null
}

function execute(options){
    var deferred = Q.defer();

    promptOptions= options;
    tempVars.options = options;

    createApp()
    .then( storeApp )
    .then( scaffold )
    .then( deferred.resolve )
    .fail( function(err){ return deferred.reject(err); } );
    
    return deferred.promise;
  }


function createApp(){
  var deferred = Q.defer();
  
  callbacks={
    done: function(){
      return deferred.resolve(this);
    },
    fail: function(error){        
      return deferred.reject( error )
    }
  }

  App.create( { billing: { size: promptOptions.size }, name: promptOptions.app_name, public_dev_key: promptOptions.public_dev_key, user_name: promptOptions.user_name, marketing: { name: promptOptions.app_name } }, callbacks )
  
  return deferred.promise;
}

function storeApp(app){
  tempVars.app = app;
  return app;
}

function scaffold(){
  console.info("Scaffolding New App".grey);

  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "app" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "app", "assets" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "code" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "start" ));
  fs.mkdirSync( Path.join( process.cwd(), "apps", tempVars.app.name , "templates" ));
  
  var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../../templates');

  var codeSrc = fs.readFileSync(  Path.join( templatesPath, "app", "code.eco" ), "utf-8");
  var indexSrc = fs.readFileSync(  Path.join( templatesPath, "app", "index.eco" ), "utf-8");
  var layoutSrc = fs.readFileSync(  Path.join( templatesPath, "app", "layout.eco" ), "utf-8");
  var packageSrc = fs.readFileSync(  Path.join( templatesPath, "app", "package.eco" ), "utf-8");
  var headSrc = fs.readFileSync(  Path.join( templatesPath, "app", "head.eco" ), "utf-8");

  var codeRender = eco.render( codeSrc , tempVars);
  var indexRender = eco.render( indexSrc , tempVars );
  var layoutRender = eco.render( layoutSrc , tempVars );
  var pckRender = eco.render( packageSrc , tempVars );
  var headRender = eco.render( headSrc , tempVars );


  fs.writeFileSync( Path.join( process.cwd(), "apps", tempVars.app.name, "code" , "index.js" ), codeRender );
  fs.writeFileSync( Path.join( process.cwd(), "apps", tempVars.app.name, "start" , "index.js" ), indexRender );
  fs.writeFileSync( Path.join( process.cwd(), "apps", tempVars.app.name, "templates" , "layout.html" ), layoutRender );
  fs.writeFileSync( Path.join( process.cwd(), "apps", tempVars.app.name, "templates" , "head.html" ), headRender );
  fs.writeFileSync( Path.join( process.cwd(), "apps", tempVars.app.name, "package.json" ), pckRender );

  return tempVars.app;
}


module.exports = execute;