//USED FOR TESTING API's
//SET URL IN SETURLHERE

var Path = require("path")
var fs = require("fs")
var Q = require("q");
var crypto = require('crypto')
var request = require("superagent")
var eco = require("eco")
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")

var promptOptions = {
  session: null,  
  app_name: null,
  target: "localhost",
  page: ""
}

var tempVars = {
  pageResponse: null,
  session: null
}

function execute(options, vars){
  var deferred = Q.defer();
  promptOptions = options;
  tempVars = vars;

  SETURLHERE()
  .then (function(){ return deferred.resolve(tempVars) })
  .fail( function(err){ return deferred.reject(err) } );
  return deferred.promise;
}

function SETURLHERE(){
  var deferred = Q.defer();
  var name = promptOptions.package.name;

  if(promptOptions.promptValues.target == "localhost") name += "_dev"

  var url = tempVars.session.instance_url + "/services/data/v31.0/sobjects/ListView"
  
  var req = request.get(url)
  .type("application/json")
  .set('Authorization', 'Bearer ' + tempVars.session.access_token )
  .send(body)
  
  req.end(function(err,res){
    if(err) return deferred.reject(err)
    console.log(res.body);
    deferred.resolve(res.body)
  })

  return deferred.promise; 
}

module.exports = execute;