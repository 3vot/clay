var fs = require('fs');
var path = require("path")
var archiver = require('archiver');
var request = require("superagent")
var fs = require("fs")
var Q = require("q")

var zipPath

var promptOptions = {
	app_name: null,
	session: null,
	version: null
}

function execute(options){
  var deferred = Q.defer();
  promptOptions = options;
  zipPath = path.join(process.cwd(), "tmp", promptOptions.app_name + ".zip" )


  packApp()
  .then( upload )
  .fail( deferred.reject );

  return deferred.promise;
}

function packApp(){
	var deffered = Q.defer();
	var output = fs.createWriteStream(zipPath);
	var archive = archiver('zip');

	output.on('close', function() {
		deffered.resolve()
	});

	archive.on('error', function(err) {
	  deffered.reject(err);
	})

	archive.pipe(output);

	archive.bulk([
	  { expand: true, cwd: 'apps/' + promptOptions.app_name + "/app/", src: ['*.*'] }
	]);

	archive.finalize();

	return deffered.promise;
}

function upload(){

	var deffered = Q.defer();
	var zip = fs.readFileSync(zipPath);
	var zip64 =  new Buffer(zip).toString('base64');
	var url = promptOptions.session.instance_url + '/services/data/v30.0/tooling/sobjects/StaticResource/'

	request.post(url)
	.set('Authorization', 'Bearer ' + promptOptions.session.access_token)
	.set('Content-Type', 'application/json')
	.send({ 'Name': promptOptions.app_name + "_" + promptOptions.version , Body: zip64, ContentType: "application/zip", CacheControl: "Public"  })

	.end(function(err,res){
		if(err){
			return deffered.reject(err);
		}
		if(res.body.success) return deffered.resolve(res.body);
		deffered.reject(JSON.stringify(res.body));
	});

	return deffered.promise;

}

module.exports = execute;