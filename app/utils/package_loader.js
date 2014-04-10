var Path = require("path")
var extend = require('util')._extend
var Log = require("./log")
var Q = require("q")

function getPackage(options){
  
  var deferred = Q.defer();
  
  
  if(!options) options = {}
  
  var packagePath = Path.join(process.cwd(), "3vot.json")
  var pck;
  try{
    pck = require(packagePath)
    Log.setUsername(pck.user_name)
  }catch(e){
    Log.error(e, "utils/package_loader", 19)
    Log.info( "Could not read Security Credentials from 3vot.json, make sure your are inside the project folder" )
    deferred.reject( "Could not read Security Credentials from 3vot.json, make sure your are inside the project folder")
  }

  process.nextTick(function(){
    options = extend(options, pck )
    deferred.resolve( options )
  })

  return deferred.promise;

}

function save(fileContents){
  var deferred = Q.defer();

   var packagePath = Path.join(process.cwd(), "3vot.json")
   fs.writeFile( packagePath,fileContents, "utf-8", function(err){
     if(err) return deferred.reject(err);
     deferred.resolve()
   });

   return deferred.promise;  
}

module.exports = getPackage

getPackage.save = save