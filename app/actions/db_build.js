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

var Log = require("../utils/log")

var promptOptions = {
  developmentMode: null,
  dbVersion: 1
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  
  
  var b = Browserify( [appPath, testPath] , { extensions: [ ".coffee", ".eco", ".html" ] } )
  
  b.transform("coffeeify");
  b.transform("brfs");

  b.require("./3vot_backend/test/microspec")
  b.require("./3vot_backend/test")

  if( options.developmentMode ) destPath = Path.join( destPath, "development" );
  else promptOptions.dbVersion = _findLastVersion(); 
  
  bundle(b)
  .then( function(src){ return saveBundle(src, ".js") } )
  .then( function(src){ return saveBundle( generateTemplate(src), ".sql" ) })
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


// Desc: Saves JS a File to System
function saveBundle( contents, type ){
  var deferred = Q.defer();
  fs.mkdir(destPath, function(){
    fs.writeFile( Path.join( destPath, getFileName(type) ) , contents, 
      function(err){
        if(err) return deferred.reject(err);
        return deferred.resolve(contents);
      }
    )
  });
  return deferred.promise;
}

function getFileName(type){
  if(promptOptions.developmentMode) return "dev" + type;
  return "v_" + promptOptions.dbVersion  + type;
}

function generateTemplate(src){
  var template = fs.readFileSync(  Path.join( templatesPath, "db", "app.eco" ), "utf-8");
  var sql = eco.render( template, { body: src, destPath: Path.join( destPath, getFileName(".js") ) , version: promptOptions.dbVersion  }  );
  return sql;  
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
