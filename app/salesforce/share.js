var fs = require('fs');
var Path = require("path")
var archiver = require('archiver');
var request = require("superagent")
var fs = require("fs")
var Q = require("q")
var WalkDir = require("3vot-cloud/utils/walk")
var Transform = require("../utils/transform")
var Log = require("3vot-cloud/utils/log")
var AwsCredentials = require("3vot-cloud/aws/credentials");

var AwsHelpers = require("3vot-cloud/aws/helpers");

var zipPath

var promptOptions = {
	app_name: null,
	session: null,
	version: null
}

var tempVars = {}

function execute(options, vars){
	Log.debug("Uploading Static Assets", "actions/salesforce/staticUpload", 22)
  var deferred = Q.defer();
  promptOptions = options;
  tempVars = vars || {};
	tempVars.key = options.user.user_name + "/share/" + options.package.name  + ".zip"
  
  zipPath = Path.join(process.cwd(), "tmp", promptOptions.package.name + ".zip" )

  packApp()
  .then( function(){ return AwsCredentials.requestKeysFromProfile( promptOptions.user.user_name, promptOptions.user.public_dev_key) })
  .then( upload )
  .then( function(){ Log.info("Download Available: http://source.3vot.com/" + tempVars.key) })
  .then( deferred.resolve )
  .fail( deferred.reject );

  return deferred.promise;
}


function packApp(){
	var deffered = Q.defer();
	
	fs.mkdir( Path.dirname(zipPath), function(err){
		var output = fs.createWriteStream(zipPath);
		var archive = archiver('zip');

		output.on('close', function() {
			return deffered.resolve()
		});

		archive.on('error', function(err) {
		  return deffered.reject(err);
		})

		archive.pipe(output);

		archive.bulk([
		  { expand: true, cwd: "./", src: ['*/**',"*.*","!tmp/**", "!node_modules/**", "!"+ promptOptions.package.threevot.distFolder +"/**"  ] }
		]);

		archive.finalize();
	});

	return deffered.promise;
}

function upload(){
  if (promptOptions.package.threevot.uploadSource === false ) return true;

  var deferred = Q.defer();  

  var fileObject = {
    path: Path.join( process.cwd(), 'tmp', promptOptions.package.name + '.zip'),
    key: tempVars.key  
  }

  Log.debug("Uploading Package to 3VOT App Store to " + fileObject.key, "actions/app_upload", 139)


  AwsHelpers.uploadFile( promptOptions.package.threevot.paths.sourceBucket, fileObject )
  .then( function(s3Error, data) {
    Log.debug("Package Uploaded Correctly to 3VOT App Store", "actions/app_upload", 150)
    deferred.resolve(data)
  })
  .fail( deferred.reject )

  return deferred.promise;
}

module.exports = execute;