#!/usr/bin/env node

var glog         =  require('gulp-api-log');
var fs = require("fs");
var App          =  require("../tasks/app");
var gutil        =  require('gulp-util');
var PluginError  =  gutil.PluginError;
var gulp         =  require("gulp")

var SfLogin      =  require("../plugins/login");
var Q            =  require("q");
var Util         =  require("util");
var minimist = require('minimist');


require("../index");


//Validation 

try{
	var p = require("../package.json")
}catch(e){
	return console.log( gutil.colors.red( "Clay can only be used inside a valid project folder with package.json and .env files." ) )
}

//var exists = fs.existsSync(process.cwd() + "/.env");
//if(!exists) return console.log( gutil.colors.red( ".env files is missing - please create a .env file.\n CLAY_CODE=\n SF_USERNAME\n SF_PASSWORD\n SF_HOST\n ** SF_xxxxxx commands are only required for Clay for Salesforce.com") );


// Argument Parsing and Construction
var argv         =  require('yargs')
.usage( gutil.colors.cyan( 'Application Development and Publishing tool \nUsage: $0 command' ) )
.describe('dev', 'Starts development Server using gulp default task')
.describe('preview', 'Uploads a preview version of the app')
.describe('publish', 'Uploads the production version of the app')
.describe('salesforce dev', 'Starts the development server and uploads a development visualforce page to Salesforce')
.describe('salesforce publish', 'Uploads the production version of the app as Static Resource + Visualforce Page to Salesforce')
.describe('salesforce login', 'Tests salesforce login with current .env file credentials')
.version( p.version )
.argv;


var showStack = false;
if( argv.d ) showStack = true;
//glog(gulp);

//
// Show Help
//

if( argv.h ) return require('yargs').showHelp();

//
// Server
//

else if( argv._[0] == "server" ){
	process.env.ZIP_NAME = process.env.NAME 
	process.env.ZIP_PATH =  process.env.ZIP_FOLDER + "/" + process.env.ZIP_NAME + ".zip" 

	gulpCall()
	.fail( doError ).done();
	
}

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
	SfLogin( process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.SF_TOKEN, process.env.SF_HOST || "login.salesforce.com" )
	.then( function(res){ console.log("Login Success") } )
	.fail( doError ).done();
}

//
// Salesforce
//
else if( argv._[0] == "salesforce" && argv._[1] == "dev" ){
	App.check( process.env.NAME )
	.then( function(){
		SfLogin( process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.SF_TOKEN, process.env.SF_HOST || "login.salesforce.com" )
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
  
  var spawn = require("win-spawn");
  var npm;

  try{
  	var optionsStarted= false;
  	for (var i = 0; i < process.argv.length; i++) {
  		var arg = process.argv[i];
  		if(arg.indexOf("--") > -1 || optionsStarted){
  			optionsStarted=true
  			task.push( arg )
  		}
  	};
  	
  	if( task )  npm  = spawn( gulpcommand ,  task  , {stdio: "inherit"} );

	  else  npm  = spawn( gulpcommand );
	  var npmResponse = "";
		
	  npm.on('close', function (code) {
	    deferred.resolve()
	  });
	}catch(e){
		console.log("NOTICE ");
		console.log("Clay can't run gulp automatically in your system, please run gulp dist by hand and then deploy.");
		process.nextTick(function(){ deferred.resolve(); })
	}

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