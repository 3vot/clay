var Path = require("path")
var Q = require("q");
var fs = require("fs")

function requireUncached(module){
  delete require.cache[ require.resolve(module) ]
  return require( module )
}

function _3vot(reload){
  var path= Path.join(process.cwd(), "3vot.json");
  if(reload) return requireUncached( path  )
  return require( path )
}

function _3vot_save(fileContents){
  var deferred = Q.defer();

   var packagePath = Path.join(process.cwd(), "3vot.json")
   fs.writeFile( packagePath, JSON.stringify(fileContents, null, '\t') , function(err){ 
     if(err) return deferred.reject(err);
     deferred.resolve()
   });

   return deferred.promise;  
}

function _package(){
  var path = Path.join( process.cwd(), "apps", promptOptions.app_name, "package.json" );
  return requireUncached( path );
}



module.exports = {
  requireUncached: requireUncached,
  _3vot: _3vot,
  _package: _package
}

_3vot.save = _3vot_save;