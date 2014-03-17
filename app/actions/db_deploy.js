
var Path = require("path")
var spawn = require('child_process')
var Q = require('q')
var WalkDir = require("../utils/walk")

var promptOptions = {
  user: null,
  password:null,
  database:null,
  host:null,
  port:null,
  version:null,
  file: null
}

var destPath = Path.join( process.cwd(), "3vot_backend", "dist"); 

function execute(options){
  var deferred = Q.defer();

  promptOptions = options.db[options.target];
  promptOptions.version = options.version || _findLastVersion()
  promptOptions.file = Path.join( destPath, "v_" + promptOptions.version  + ".sql" ); 

  command = 'PGPASSWORD="' + promptOptions.password + '" psql sslmode=require -U ' + promptOptions.user  + ' -q -d ' + promptOptions.database + '  -h ' + promptOptions.host + ' -p ' + promptOptions.port + ' --file=' + promptOptions.file

  child = spawn.exec(command,  function (error, stdout, stderr) {
    if(error) return deferred.reject(error)
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
  });
  
  child.on("close", function(){
    deferred.resolve()
  })

  return deferred.promise;

}

function _findLastVersion(){
  var files = WalkDir( destPath );
  var version = 0
  files.forEach( function(path){
    thisVersion = parseInt( path.name.split(".")[0].split("_")[1] )
    if(thisVersion > version) version = thisVersion;
  });
  return version;
}

module.exports = execute