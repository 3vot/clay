var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
var prompt = require("prompt")

Version = (function() {

  function Version() {}

  Version.prompt = function(){
    prompt.start();
    prompt.get( [ 
      { name: 'app', description: 'App: ( The Application that you want to upgrade the version by 0.0.1 )' } ], function (err, result) {
        Version.upgradeVersion( result.app )
        .then( function(version){ console.log(("App Version is now " + version).green); } )
        .fail( function(err){ console.error(err.red); })
    });
  }

  Version.upgradeVersion = function(appName){
    var deferred = Q.defer();
    
    var pckPath = Path.join(process.cwd(), "apps", appName, "package.json" );
    var pkg = require( pckPath );
    var parts = pkg.version.split(".");
    parts[parts.length -1 ] = "" + ( parseInt( parts[parts.length -1 ] ) + 1 ) ;
    pkg.version = parts.join(".");

    fs.writeFile(pckPath, JSON.stringify( pkg, null, '\t' ), function(err){
      if(err) deferred.reject( err );
      deferred.resolve( pkg.version );
    });
    
    return deferred.promise;
    
  }
  
  return Version;

})();

module.exports = Version;



