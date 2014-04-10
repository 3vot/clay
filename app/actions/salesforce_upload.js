var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")

var Transform = require("../utils/transform")
var Upload =require("../salesforce/upload")
var Login =require("../salesforce/login")
var Log = require("../utils/log")

var promptOptions = {
  public_dev_key: null,
  user_name: null,
  app_name: null,
  salesforce: null,
  target: "localhost"
}

var tempVars = {
  salesforce: null,
  package_json: null,
  pageResponse: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  
  Login(promptOptions)
  .then( renderPage )
  .then( function(){ return Upload(promptOptions) } )
  .then (function(){ return deferred.resolve() })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
}

function renderPage(){
  var deferred = Q.defer();
  
  Log.debug("Rendering Page","actions/salesforce_upload", 45)

  var templatePath = Path.join(Path.dirname(fs.realpathSync(__filename)), '..' , ".." , 'templates',"salesforce" , "page.eco" );
  var app = fs.readFileSync( templatePath, "utf-8" )

  try{
    var package_json = require( Path.join( process.cwd(), "apps", promptOptions.app_name, "package.json" )  );
  }catch(e){
    deferred.reject("App " + app_name + " not found. Did you create it? Create an app or template before we can send it to salesforce.")
  }

  var headProbablePath = Path.join( process.cwd(), "apps", promptOptions.app_name, "templates","head.html" );
  var head = ""
  try{ head = fs.readFileSync( headProbablePath, "utf-8") }catch(err){}
  var result = eco.render(app, { pck: package_json, user_name: promptOptions.user_name, head: head } );
  result = Transform[promptOptions.target](result, promptOptions.user_name, promptOptions.app_name, promptOptions.domain )
  promptOptions.page = result;
  
  process.nextTick(function(){ deferred.resolve(result); });
  return deferred.promise;
}



module.exports = execute;