var bower = require("bower");

var Path = require("path")
var fs = require("fs")
var Q = require("q");
Q.longStackSupport = true;

_3setup = (function() {

  function _3setup() {}

  _3setup.setup = function(options){

    _3setup.scaffold(options)
    .then( _3setup.installNPM )
    .fail( function(err){ console.error(err); } );

  }

  _3setup.scaffold= function (options){

    var deferred = Q.defer();
    

    fs.mkdir( Path.join( process.cwd(), options.folder ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "apps" ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "apps", "dependencies" ), function(){} );
    fs.mkdir( Path.join( process.cwd(), options.folder , "tmp" ), function(){}) ;

    var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), './templates');
  
    var _3votJSON = require( Path.join(  templatesPath, "_3vot.json" ));
    var gitIgnore = fs.readFileSync(  Path.join( templatesPath, "_.gitignore" ), "utf-8");
    var pckJSON = require( Path.join( templatesPath, "package.json" ));

    _3votJSON.key = options.key;
    _3votJSON.profile = options.profile;

    fs.writeFileSync( Path.join(process.cwd(), options.folder, "3vot.json"), JSON.stringify(_3votJSON, null, '\t') );
    fs.writeFileSync( Path.join(process.cwd(), options.folder, "package.json"), JSON.stringify(pckJSON, null, '\t') );
    fs.writeFile( Path.join(process.cwd(), options.folder, ".gitignore"), gitIgnore, function(){ deferred.resolve()  } );

    return deferred.promise

  }


  _3setup.installNPM= function(){
     var deferred = Q.defer();
     
     var npm = require("npm");

      npm.load(npm.config, function (er) {
        if (er) return handlError(er);
        npm.commands.install(["."], function (er, data) {
          if (er) return deferred.reject(er)
          return deferred.resolve()
          // command succeeded, and data might have some info
        });
        npm.on("log", function (message) { })
      });
      
      return deferred.promise;
      
  }
  
  return _3setup;

})();

module.exports = _3setup;