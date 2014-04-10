var Path = require("path")
var fs = require("fs")
var Q = require("q");

var eco = require("eco")
var Transform = require("../utils/transform")

var Upload =require("../salesforce/upload")

var Log = require("../utils/log")

var Login = require('../salesforce/login')

var request = require("superagent")


var promptOptions = {
  public_dev_key: null,
  salesforce_user: null,
  password: null,
  key: null
}

var tempVars = {}



function execute(options){
  Log.info("Updating the Salesforce Profile Page AppsFrom3vot", "actions/salesforce_profile", 29)
  var deferred = Q.defer();
  options.app_name = "AppsFrom3vot"
  promptOptions = options;

  Login(promptOptions)
  .then( createDefaultProfileApp )
  .then( renderPage )
  .then( function(){ return Upload( promptOptions ) } )
  .then (function(){ return deferred.resolve() })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
  }

function createDefaultProfileApp(){
  var deferred = Q.defer();

  request.get("http://3vot.com/templates/salesforce_profile/index.html").end(function(err,res){
    if(err) return deferred.reject(err)
    promptOptions.page = res.text;
    return deferred.resolve(res.text)
  })

  return deferred.promise;
}

function renderPage(){
  var deferred = Q.defer();
  var templatePath = Path.join(Path.dirname(fs.realpathSync(__filename)), '..' , ".." , 'templates',"salesforce" , "html-page.eco" );
  var app = fs.readFileSync( templatePath, "utf-8" )

  var footer = '<script> _3vot.override_user_name = "' + promptOptions.user_name + '"; </script>';

  var result = eco.render(app, { html: tempVars.page, footer: footer } );
  promptOptions.page = result;
  
  process.nextTick(function(){ deferred.resolve(result); });
  return deferred.promise;
}



module.exports = execute;