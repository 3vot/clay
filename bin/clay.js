#!/usr/bin/env node

var glog         =  require('gulp-api-log');

var App          =  require("../tasks/app");
var gutil        =  require('gulp-util');
var PluginError  =  gutil.PluginError;
var gulp         =  require("gulp")
var argv         =  require('yargs').argv;
var SfLogin      =  require("../plugins/login");
var Q            =  require("q");
var Util         =  require("util");

var p = require("../package.json")

require("../index");

var showStack = false;
if( argv.d ) showStack = true;
//glog(gulp);

//
// Version
//


if( argv.v ) return console.log( p.version );

//
// Preview
//

if( argv._[0] == "preview" ){
	process.env.ZIP_NAME =  process.env.NAME + "_stage" ;
	process.env.ZIP_PATH =  process.env.ZIP_FOLDER + "/" + process.env.ZIP_NAME + ".zip" 

	gulpCall("dist")
	.then( function(){ 
		return App.check( process.env.NAME )
		.then( preview )
		.fail( doError ).done();
	})
	.fail( doError ).done();

	function preview(){
		
		gulp.start("CLAY_DIST");
		return false;
	}
}


//
// Publish
//

else if( argv._[0] == "publish" ){
	process.env.ZIP_NAME = process.env.NAME 
	process.env.ZIP_PATH =  process.env.ZIP_FOLDER + "/" + process.env.ZIP_NAME + ".zip" 

	gulpCall("dist")
	.then( function(){ 
		App.check( process.env.NAME )
		.then(publish)
		.fail( doError )
	})
	.fail( doError ).done();
	
	function publish(){
		gulp.start("CLAY_DIST")
		
		return false;
	}
}

//
// Salesforce
//
else if( argv._[0] == "salesforce" && argv._[1] == "publish" ){
	process.env.ZIP_NAME =  process.env.NAME ;
	process.env.ZIP_PATH   = process.env.ZIP_FOLDER + "/" + process.env.ZIP_NAME + ".zip" 

	App.check( process.env.NAME )
	//.then( function(){ SfLogin( process.env.SF_USERNAME, process.env.SF_PASSWORD, process.env.SF_HOST || "login.salesforce.com" ) })
	.then( salesforcePublish )
	.fail( doError ).done();
	
	function salesforcePublish(){
		gulpCall( "dist" ) ;
		return false;
	}
}

//
// Salesforce
//
else if( argv._[0] == "salesforce" && argv._[1] == "login" ){
	SfLogin( process.env.SF_USERNAME, process.env.SF_PASSWORD, process.env.SF_HOST || "login.salesforce.com" )
	.then( function(res){ console.log("Login Success") } )
	.fail( doError ).done();
}

//
// Salesforce
//
else if( argv._[0] == "salesforce" ){
	App.check( process.env.NAME )
	.then( function(){
		SfLogin( process.env.SF_USERNAME, process.env.SF_PASSWORD, process.env.SF_HOST || "login.salesforce.com" )
		.then( salesforce ).done();
	})
	.fail( doError ).done();
	
	function salesforce( session ){
		gulpCall("-sf:" + JSON.stringify( session ) ) ;
		return false;
	}
}

//
// Create
//
else if( argv._[0] == "create"  ){
	if( argv._.length < 2 || !argv._[1] ) return doError( "Tip: Type the app name after create, ie: clay create APP_NAME_GOES_HERE"  );

	var appName = argv._[1];
	if( appName.indexOf("_") >= 0 ) return doError("Tip: App Name can have '-' characters.")

	App.create( appName )
	.then( function(){ 
		gutil.log( gutil.colors.green( 'Creation Complete' ) );
		return false;
	})
	.fail( doError ).done();
}

else gulpCall();

function gulpCall( task){
	if(!task) task = argv._[0]
	if(!task) task = "default"
	if( !Util.isArray(task) ) task = [ task ]

	var deferred = Q.defer();

	var exec = require('child_process').exec;

  var gulpcommand = "gulp";
  
  var spawn = require('child_process').spawn
  var npm;
  
  if( task )  npm  = spawn( gulpcommand , task , {stdio: "inherit"} );

  else  npm  = spawn( gulpcommand );
  var npmResponse = "";
	
  npm.on('close', function (code) {
    deferred.resolve()
  });

  return deferred.promise;
}

function doError(err){
	gutil.log( gutil.colors.red( 'Sorry we encountered an error' ) );

 	if( typeof err == "string" ){
 		if(err.indexOf("APP_NOT_FOUND")) gutil.log( gutil.colors.red( "App was not found, or you don't have permissions. Create an app with clay create APP_NAME" ) );
 		gutil.log( gutil.colors.red( err ) );
 	}
 	else{
		throw new PluginError(
	    'r2',
	    err,
	    { showStack: showStack }
	  );
	}
}