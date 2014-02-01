// Generated by CoffeeScript 1.3.3
var Parse, Package, Q;

Q = require("q");

Parse = require("parse").Parse;

Package = (function() {

  function Package() {}

  Package.findByAttributes = function(nameValuePairs) {
    var Packages, deferred, error, name, packageQuery, success, value;
    deferred = Q.defer();
    Packages = Parse.Object.extend("Packages");
    packageQuery = new Parse.Query(Packages);
    for (name in nameValuePairs) {
      value = nameValuePairs[name];
      packageQuery.equalTo(name, value);
    }
    
    success = function(results) {
      return deferred.resolve(results);
    };
    error = function(err) {
      return deferred.reject(err);
    };
    packageQuery.find().then(success, error);
    return deferred.promise;
  };

  Package.save = function(package){
    console.info("Saving Package".grey)
    var deferred = Q.defer();

    package.save().then(
      function(package){ return deferred.resolve(package); } ,
      function(err){ return deferred.reject(err); }
    );

    return deferred.promise;
  }

  return Package;

})();

module.exports = Package;