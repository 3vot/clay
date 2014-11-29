var fs = require('fs');
var Path = require("path")
var archiver = require('archiver');
var request = require("superagent")
var fs = require("fs")
var Q = require("q")
var WalkDir = require("3vot-cloud/utils/walk")
var Transform = require("../utils/transform")
var Log = require("3vot-cloud/utils/log")

var jsforce = require("jsforce")

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
  tempVars = vars;

  zipPath = Path.join(process.cwd(), "tmp", promptOptions.package.name + ".zip" )

  transform();


  packApp()
  .then( upload )
  .then( deferred.resolve )
  .fail( deferred.reject );

  return deferred.promise;
}

function transform(){
	var apps = WalkDir( Path.join( process.cwd(), promptOptions.package.threevot.distFolder ) );

  apps.forEach( function(path){
  	var body = ""
  	if(path.name == "3vot.js" ) body = Transform.readByType(path.path, "_3vot", {});
  	else body = Transform.readByType(path.path, "sf", promptOptions);
     
    fs.writeFileSync(path.path,body);
	});
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
		  { expand: true, cwd: promptOptions.package.threevot.distFolder, src: ['*.*','**','**/**'] }
		]);

		archive.finalize();
	});

	return deffered.promise;
}

function upload(){
	var deffered = Q.defer();
	var zip = fs.readFileSync(zipPath);
	var zip64 =  new Buffer(zip).toString('base64');
	var url = tempVars.session.instance_url + '/services/data/v30.0/tooling/sobjects/StaticResource/'

	var name = promptOptions.package.name
	if(promptOptions.promptValues.publish == false) name +=  "_" + promptOptions.package.threevot.version

		var conn = new jsforce.Connection({
		accessToken: tempVars.session.access_token,
		instanceUrl: tempVars.session.instance_url
	});

	var ns = ""
	if(promptOptions.package.threevot.namespace) ns = promptOptions.package.threevot.namespace + "__"

	var fullNames = [ {
		fullName: ns + name,
		content: zip64,
		contentType: "application/zip", 
		cacheControl: "Public"  ,
		}
	];

	conn.metadata.upsert('StaticResource', fullNames, function(err, results) {
	  console.log(results)
	  return deffered.resolve();
	  if (err) return deffered.reject(err);
	});

	return deffered.promise;

}



module.exports = execute;