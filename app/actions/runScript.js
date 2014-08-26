var Q = require("q");
var Profile = require("3vot-cloud/models/profile")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")
var Walk = require("3vot-cloud/utils/walk")
var Path = require("path")

var prompt = require("prompt")


var promptOptions = {
  public_dev_key: null,
  users: null,
}

var tempVars = {
  profile: null,
  process: [],
  selectedProcess: null
}

var scriptPath = Path.join(process.cwd(), "scripts" )


function execute(options){
  promptOptions = options;
  var deferred = Q.defer();

  discoverProcess()

  promptForProcess()
  .then( function(){ 
    return Q.all( createPromises() ); 
  })
  .then( deferred.resolve )
  .fail( deferred.reject )

  return deferred.promise;
}

function discoverProcess(){
  var files = Walk(scriptPath);
  var process= [];
  for (var i = files.length - 1; i >= 0; i--) {
    var file = files[i];
    if(file.name.indexOf(".json") != -1) tempVars.process.push( require(file.path) )
  };
}

function promptForProcess(object){
  var deferred = Q.defer();

  prompt.start();

  var description = "Select a process to run:\n";
  var index = 1;
  var processArray = [];
  for( processIndex in tempVars.process){
    var process  = tempVars.process[processIndex]

    description += index + ": " + process.name + "\n" + process.description + "\n" + "\n";
    processArray.push( process );
    index++;
  }

  var prompts = [ 
    { name: 'process_index', description: description }
  ]

  prompt.get(prompts, function (err, result) {
    var process  = processArray[ parseInt(result.process_index) - 1 ];
    tempVars.selectedProcess = process;
    deferred.resolve();
  });

  return deferred.promise;
}

function createPromises(){
   var scriptsToRun = []
  for (var i = tempVars.selectedProcess.scripts.length - 1; i >= 0; i--) {
    var scriptName = tempVars.selectedProcess.scripts[i]
    var scriptFile = Path.join( scriptPath, scriptName )
    var scriptExecute = require( scriptFile )
    scriptsToRun.push( runScript(scriptExecute) );
  };
  return scriptsToRun;
}

function runScript(executeFunction){
  var deferred = Q.defer();
  var _this = this;
  executeFunction(promptOptions, function(err, result){
    if (err) return deferred.reject(err)
    return deferred.resolve(result)
  });
  return deferred.promise;
}


module.exports = execute;