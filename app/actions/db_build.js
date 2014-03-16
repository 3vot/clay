var WalkDir = require("../utils/walk")
var Q = require("q")
var Path = require("path")
var Browserify = require("browserify")
var fs = require("fs")
var eco = require("eco")

var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../../templates');
var appPath = Path.join( process.cwd(), "3vot_backend", "index.js");
var testPath = Path.join( process.cwd(), "3vot_backend", "test" , "index.js");
var destPath = Path.join( process.cwd(), "3vot_backend", "dist" );

var dbVersion = 1;

function execute(entry){
  var deferred = Q.defer();
  var entryName = entry + ".js";
  
  var b = Browserify( [appPath, testPath] , { extensions: [ ".coffee", ".eco", ".html" ] } )
  
  b.transform("coffeeify");
  b.transform("brfs");

  b.require("./3vot_backend/test/microspec")
  b.require("./3vot_backend/test")
  
  dbVersion = _findLastVersion();
  
  bundle(b)
  .then( function(src){ return saveBundle(src, ".js") } )
  .then( saveTemplate )
  .then( deferred.resolve )
  .fail( function(error){ console.log(error); deferred.reject(error); }  )
  return deferred.promise;
}

function bundle(b){
  var deferred = Q.defer();
  
  b.bundle( {}, 
     function(err, src) {
       if (err) return deferred.reject(err)
       deferred.resolve(src)
     }
   );
  
  return deferred.promise;
}

function saveTemplate( src ){
  var template = fs.readFileSync(  Path.join( templatesPath, "db", "app.eco" ), "utf-8");
  var sql = eco.render( template, { body: src, destPath: destPath, version: dbVersion  }  )
  return saveBundle( sql, ".sql" )
}

// Desc: Saves a File to System
function saveBundle( contents, type ){
  var deferred = Q.defer();
  fs.mkdir(destPath, function(){
    fs.writeFile(  Path.join( destPath, "v_" + dbVersion  + type) , contents, 
      function(err){
        if(err) return deferred.reject(err);
        return deferred.resolve(contents);
      }
    )
  });
  return deferred.promise;
}

function _findLastVersion(){
  var files = WalkDir( destPath );
  var version = 0
  files.forEach( function(path){
    thisVersion = parseInt( path.name.split(".")[0].split("_")[1] )
    if(thisVersion > version) version = thisVersion;
  });
  return version + 1;
}

module.exports = execute
