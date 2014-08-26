var Path = require("path")
var fs = require("fs")
var Q = require("q");


var promptOptions = {

}

var tempVars = {

}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;


  tempVars.templatePath =  Path.join(Path.dirname(fs.realpathSync(__filename)), "..","..","templates","salesforce", promptOptions.promptValues.objectName + ".json")

  tempVars.mockPath = Path.join( process.cwd(), "mock", promptOptions.promptValues.objectName + ".json" )

  download()
  .then( save )
  .then( deferred.resolve )
  .fail( deferred.reject );

  return deferred.promise;
}

function download(){
  var deferred = Q.defer();
  
  fs.readFile( tempVars.templatePath, function(err,result){
    if(err) return deferred.reject(err)
    tempVars.json = result;
    deferred.resolve()
  } )
 

  return deferred.promise;

}

function save(){
  var deferred = Q.defer();
  
  fs.writeFile( tempVars.mockPath, tempVars.json, function(err){
    if(err) return deferred.reject(err)
    deferred.resolve()
  } )
 
  return deferred.promise;
}


module.exports = execute;