var Path = require("path")
var extend = require('util')._extend

var Q = require("q")

function getPackage(options){
  
  var deferred = Q.defer();
  
  
  if(!options) options = {}
  
  var packagePath = Path.join(process.cwd(), "3vot.json")
  
  var pck = require(packagePath)
  
  
  process.nextTick(function(){
    deferred.resolve( extend(options, pck ) )
  })

  return deferred.promise;

}

module.exports = getPackage