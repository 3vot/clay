var Path = require("path")
var extend = require('util')._extend

var Q = require("q")

function getPackage(options){
  
  var deferred = Q.defer();
  
  
  if(!options) options = {}
  
  var packagePath = Path.join(process.cwd(), "3vot.json")
  var pck;
  try{
    pck = require(packagePath)
  }catch(e){
    console.log("Package Loader Error " + e)
    deferred.reject( "Could not read Security Credentials from 3vot.json, make sure your are inside the project folder")
  }

  process.nextTick(function(){
    options = extend(options, pck )
    deferred.resolve( options )
  })

  return deferred.promise;

}

module.exports = getPackage