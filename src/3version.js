var Parse = require('parse').Parse;
var Path = require("path")
var fs = require("fs")
var Q = require("q");
Q.longStackSupport = true;

_3version = (function() {

  function _3version() {}



  _3version.upgradeVersion = function(appName){
    var deferred = Q.defer();
    
    var pckPath = Path.join(process.cwd(), "apps", appName, "package.json" );
    var pkg = require( pckPath );
    var parts = pkg.version.split(".");
    parts[parts.length -1 ] = "" + ( parseInt( parts[parts.length -1 ] ) + 1 ) ;
    pkg.version = parts.join(".");

    fs.writeFile(pckPath, JSON.stringify( pkg, null, '\t' ), function(err){
      if(err) deferred.reject( err )
      deferred.resolve();
    });
    
    return deferred.promise;
    
  }
  
  return _3version;

})();

module.exports = _3version;



