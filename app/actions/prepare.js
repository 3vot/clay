var Path = require("path")
var fs = require("fs")
var Q = require("q");

var Profile = require("3vot-cloud/models/profile")
var AwsCredentials = require("3vot-cloud/aws/credentials");
var Log = require("3vot-cloud/utils/log")
var Packs = require("3vot-cloud/utils/packs")
var Install = require("3vot-cloud/utils/install")
var Encrypt = require('../salesforce/encrypt')

var profile = {};

var promptOptions = {
  key: null,
	email: null,
	password: null,
	token: null
}

var tempVars = {
  profile: null
}

function execute(options){
	var deferred = Q.defer();
	promptOptions = options;
	scaffold()
	.then( Install.installNPM )
	.then( function(){ process.chdir( Path.join( process.cwd(), ".." ) ); } )
	.then (function(){ return deferred.resolve(promptOptions) })
	.fail( function(err){ return deferred.reject(err) } );
	return deferred.promise;
}

function scaffold(){
   Log.debug("Scaffolding Projects", "actions/profile_setup", 52);
   var deferred = Q.defer();

   
   fs.mkdirSync( Path.join( process.cwd() , "apps" ));
   fs.mkdirSync( Path.join( process.cwd() , "apps", "dependencies" ));
   fs.mkdirSync( Path.join( process.cwd() , "tmp" )) ;

   var templatesPath =  Path.join(Path.dirname(fs.realpathSync(__filename)), '../../templates');
   var _3votJSON = {}
   var gitIgnore = fs.readFileSync(  Path.join( templatesPath, "_.gitignore" ), "utf-8");
   var pckJSON = require( Path.join( templatesPath, "package.json" ));

   _3votJSON.public_dev_key = promptOptions.key
  _3votJSON.salesforce = {
    user_name: Encrypt.hide(promptOptions.email, promptOptions.password),
    key: Encrypt.hide(promptOptions.token, promptOptions.password)
  }

   fs.writeFileSync( Path.join(process.cwd(), "3vot.json"), JSON.stringify(_3votJSON, null, '\t') );
   fs.writeFileSync( Path.join(process.cwd(), "package.json"), JSON.stringify(pckJSON, null, '\t') );
   fs.writeFile( Path.join(process.cwd(), ".gitignore"), gitIgnore, function(){ deferred.resolve(  )  } );

   return deferred.promise;
 }


module.exports = execute;