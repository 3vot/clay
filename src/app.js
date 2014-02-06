var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
var eco = require("eco")
Q.longStackSupport = true;
var prompt = require("prompt")


var AwsCredentials = require("./aws/credentials");
var AwsHelpers = require("./aws/helpers");

var Profile = require("./model/profile")
var Package = require("./model/package")


App = (function() {

  App.promptCreate = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'name', description: 'App Name ( The name of the app you want to create )' } ], function (err, result) {
      var app = new App(result);
      app.createApp()
      .fail( function(err){console.error(err); } )
    });
  }
  
  var app = {}
  
  function App(options) {
    app = options;
  }
  
  App.prototype.createApp = function(){
    var deferred = Q.defer();

    this.getProfile()
    .then( this.getPackage )
    .then( this.validatePackage )
    .then( this.scaffold )
    .then( deferred.resolve )
    .fail( function(err){ return deferred.reject(err); } );
    
    return deferred.promise;

  }

  App.prototype.getProfile= function(){
    var config = require(Path.join( process.cwd(), "3vot.json") );
    var deferred = Q.defer();
    Profile.findByAttributes( { "public_dev_key": config.key } )
    .then( function(results){
      if(results.length === 0){ return deferred.reject("We could not find a profile with the provided key. Check Configuration in 3vot.json")  }
      app.profile = results[0];
      app.username = app.profile.get("username")
      return deferred.resolve( app.profile );
    })
    .fail( function(err){ deferred.reject(err) } )
    
    return deferred.promise;
  }

  App.prototype.getPackage= function(){
    var config = require(Path.join( process.cwd(), "3vot.json") );
    var deferred = Q.defer();
    Package.findByAttributes( { "username": app.username, "name": app.name  } )
    .then( function(results){
      if(results.length > 0) return deferred.reject( "The App " + app.name + " already exists. Please choose another name" )
      deferred.resolve()      
    })
    .fail( function(err){ deferred.reject(err) } )

    return deferred.promise;
  }

  App.prototype.scaffold = function (){
    console.info("Scaffolding New App".grey);


    var options = {
      key: app.profile.get("public_dev_key"),
      profile: app.profile.get("username"),
      folder: "3vot_" + app.profile.get("username")
    }

    fs.mkdirSync( Path.join( process.cwd(), "apps", app.name ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", app.name , "app" ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", app.name , "app", "assets" ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", app.name , "code" ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", app.name , "start" ));
    fs.mkdirSync( Path.join( process.cwd(), "apps", app.name , "templates" ));
    
    var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../templates');
  
    var codeSrc = fs.readFileSync(  Path.join( templatesPath, "app", "code.eco" ), "utf-8");
    var indexSrc = fs.readFileSync(  Path.join( templatesPath, "app", "index.eco" ), "utf-8");
    var layoutSrc = fs.readFileSync(  Path.join( templatesPath, "app", "layout.eco" ), "utf-8");
    var packageSrc = fs.readFileSync(  Path.join( templatesPath, "app", "package.eco" ), "utf-8");
    var headSrc = fs.readFileSync(  Path.join( templatesPath, "app", "head.eco" ), "utf-8");


    var codeRender = eco.render( codeSrc , { profile: app.profile, name: app.name });
    var indexRender = eco.render( indexSrc , { profile: app.profile, name: app.name });
    var layoutRender = eco.render( layoutSrc , { profile: app.profile, name: app.name });
    var pckRender = eco.render( packageSrc , { profile: app.profile, name: app.name });
    var headRender = eco.render( headSrc , { profile: app.profile, name: app.name });

    fs.writeFileSync( Path.join( process.cwd(), "apps", app.name, "code" , "index.js" ), codeRender );
    fs.writeFileSync( Path.join( process.cwd(), "apps", app.name, "start" , "index.js" ), indexRender );
    fs.writeFileSync( Path.join( process.cwd(), "apps", app.name, "templates" , "layout.html" ), layoutRender );
    fs.writeFileSync( Path.join( process.cwd(), "apps", app.name, "templates" , "head.html" ), headRender );
    fs.writeFileSync( Path.join( process.cwd(), "apps", app.name, "package.json" ), pckRender );

    return true;
  }

  return App;

})();

module.exports = App;