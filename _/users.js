var gulp   = require('gulp');
var path   = require("path");
var chalk  = require('chalk');
var gutil  = require('gulp-util');
var Q      = require("q");
var fs     = require("fs");
var extend = require('util')._extend;
var prompt = require("prompt");
var chalk  = require('chalk');

var Request    =   require("superagent");

function get( namespace ){
  if(!namespace) namespace= "3votbuilder";

  var deferred = Q.defer();

  spawn( [ "get", namespace ] )
  .then( function(result){ 
    if( !result ) return deferred.reject("User not found - visit register.3vot.com and add add an user with users --add ");
    deferred.resolve( result )
  })
  .fail( deferred.reject ).done();

  return deferred.promise;
}


function reset(namespace){
  if(!namespace) namespace = "3votbuilder"

  var deferred = Q.defer();
    spawn(["set", namespace, null ] )
    .then( deferred.resolve )
    .fail( deferred.reject ).done();
 return deferred.promise; 
}

function set(contents, namespace){
  if(!namespace) namespace = "3votbuilder"

  var deferred = Q.defer();

  function onResponse(res){
    if (res.ok && responseOk(res.body) ) {
      res.body = JSON.parse(res.body)  
      spawn(["set", namespace, contents ] )
      .then( deferred.resolve )
      .fail( deferred.reject ).done();
    } 
    else return deferred.reject( res.error || res.body )

  }

  Request.get( "https://clay.secure.force.com/api/services/apexrest/clay-api" )
  .set('Accept', 'application/json')
  .type("application/json")
  .query("dev_code=" + contents)
  .end( onResponse );

   return deferred.promise;  
}

function spawn(commands){
  var deferred = Q.defer();

  var exec = require('child_process').exec;

  var npmcommand = (process.platform === "win32" ? "npm.cmd" : "npm")
  
  var spawn = require('child_process').spawn
  var npm    = spawn(npmcommand, commands);
  var npmResponse = "";

  npm.stderr.setEncoding('utf8');
  npm.stderr.on('data', function (data) {
    deferred.reject(data)
  });

  npm.on('error', function (err) {
    return deferred.reject(err);
  });
  
  npm.stdout.on('data', function (data) {
    if( data.toString().indexOf("undefined") == -1 ) npmResponse += data.toString();
    else npmResponse = null
  });

  npm.on('close', function (code) {
    if(npmResponse) npmResponse = npmResponse.replace(/(\r\n|\n|\r)/gm,"");
    
    return deferred.resolve(npmResponse)
  });

  return deferred.promise;  
}

function responseOk(responseBody){
  if(responseBody.indexOf("ERROR_CODE") > -1) return false
  return true;
}

module.exports = {
  get: get,
  set: set,
  reset: reset
}
