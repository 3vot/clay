'use strict';

var chalk = require('chalk');
var JSZip = require('jszip');

var fs          = require('fs');
var path        = require('path');
var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var Q       = require("q");


var jsforce = require("jsforce")


function StaticResource( opts) {
  
  opts = opts || {};
  opts.compress = true;

  var firstFile;
  var zip = new JSZip();

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb();
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-salesforce', 'Streaming not supported'));
      return;
    }

    if (!firstFile) {
      firstFile = file;
    }

    // because Windows...
    var pathname = file.relative.replace(/\\/g, '/');

    zip.file(pathname, file.contents, {
      date: file.stat ? file.stat.mtime : new Date(),
      createFolders: true
    });

    cb();
  }, function (cb) {
    if (!firstFile) {
      cb();
      return;
    }


    var zipFile = new gutil.File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      contents: zip.generate({
        type: 'nodebuffer',
        compression: opts.compress ? 'DEFLATE' : 'STORE',
        comment: opts.comment
      })
    });

    //this.push( zipFile );
    upload( zipFile, opts, cb )
  });
};

function upload(  file , opts, cb ){
  var zip64 = file.contents.toString('base64');
  var name  = opts.name

  if( !opts.namespace ) opts.namespace = ""

  var fullNames = [{
    fullName:     opts.namespace + opts.name,
    content:      zip64,
    contentType: "application/zip", 
    cacheControl: "Public"  ,
  }];

  login( process.env.SF_USERNAME,process.env.SF_PASSWORD, process.env.SF_HOST )
  .then( function(){
    var conn  = new jsforce.Connection({
      accessToken: process.env.ACCESS_TOKEN,
      instanceUrl: process.env.INSTANCE_URL
    });
    
    gutil.log('Starting', gutil.colors.cyan( 'Static Resource Upload' ));
    conn.metadata.upsert( 'StaticResource', fullNames, function( err, results ) {
      if( err ) cb( err );
      gutil.log("Finished", gutil.colors.cyan( 'Static Resource Upload' ));
      return cb();
    });
  }).fail( cb )
}

function login( username, password, host ){
  var deferred = Q.defer();
  


  if ( process.env.INSTANCE_URL ) process.nextTick( function(){ deferred.resolve() } );
  else
  

  gutil.log( gutil.colors.cyan( 'Login to Salesforce' ));

    var username = username;
    var password = password;
    var host = host || "login.salesforce.com"

    var conn = new jsforce.Connection({
      loginUrl : 'https://' + host
    });

    conn.login( username, password, function( err, userinfo ){
      if(err) deferred.reject(err)
      else{
        process.env.INSTANCE_URL = conn.instanceUrl;
        process.env.ACCESS_TOKEN = conn.accessToken;
        deferred.resolve();
      }
    });
  return deferred.promise; 
}

module.exports = StaticResource;