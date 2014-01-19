var bower = require("bower");


var Path = require("path")
var fs = require("fs")
var Q = require("Q");
Q.longStackSupport = true;

_3bower = (function() {

  function _3bower() {}

  _3bower.install= function(destinationDir, packagesToInstall ){
    var deferred = Q.defer();
    
    bower.config.directory = destinationDir;
    
    bower.commands
    .install(packages, {}, {} )
    .on('end', function (installed) {
        deferred.resolve()
    })
    .on("error", function (error) {
        deferred.reject(error);
    });
    
    return deferred.promise;
    
  }

  return _3bower;

})();

module.exports = _3bower;