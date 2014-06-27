var express = require('express');
var fs = require("fs");
var Path = require("path");
var http = require('http');
var https = require('https');
var url = require("url");
var prompt = require("prompt")
var argv = require('optimist').argv;
var request = require("superagent")
var devDomain = null;
var _3vot = require("3vot/utils")
var send = require('send');

var mime = require('mime');

var Server = {}
var Builder = require("3vot-cloud/utils/builder");
var WalkDir = require("3vot-cloud/utils/walk")
var AppBuild = require("3vot-cloud/app/build")

var Q = require("q")

var Log = require("3vot-cloud/utils/log")

Server.domain = "localhost:3000"
Server.ssl = true;

var sslOptions = {
  key: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)), "..", 'ssl' , "server.key" )),
  cert: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)),"..", 'ssl' , "server.crt" )),
  ca: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)), "..",'ssl' , "ca.crt" )),
  requestCert: true,
  rejectUnauthorized: false
};

var app = express();    
var pck = require( Path.join( process.cwd(), "3vot.json" )  );
var profile = pck.user_name;
// all environments
app.set('port', 3000);
app.disable('etag');
app.enable('strict routing');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);


  app.get("/", function(req,res){
    res.send("<h1>Congratulations CLAY Local Server is Running</h1>");
  });

  app.get("/:app_name/:file", function(req, res) {
    var asset = req.params.asset;
    var app_name = req.params.app_name;
    var file = req.params.file;
    return middleware(app_name, file, req,res)
  });

  app.get("/:app_name/assets/:asset", function(req, res) {
    var asset = req.params.asset;
    var app_name = req.params.app_name;
    var filePath = Path.join(  process.cwd() , "apps", app_name, "app", "assets", asset );
    
    var isText = null;
    if( filePath.indexOf(".js") > -1 || filePath.indexOf(".css") > -1 || filePath.indexOf(".html") > -1){

      isText = "utf-8"

      var file = fs.readFileSync(filePath,isText)
      file = _3vot.replaceAll(file, "*/assets", "https://localhost:3000/" + app_name + "/assets");
    
      res.set('Content-Type', mime.lookup(filePath) );
      res.send(file);
    }
    else{ res.sendfile(filePath) }

  });

https.createServer(sslOptions, app).listen(app.get('port'), function(){
  console.info('3VOT Server running at:  https://' + Server.domain );
}); 


function middleware(app_name,file_name,req, res) {
 
  checkApp(app_name)
  .then(function(){ buildApp(app_name); })
  .then(function(){

    var filePath = Path.join(  process.cwd() , "apps", app_name, "app", file_name );

    var fileBody = fs.readFileSync(filePath,"utf-8")

    if(file_name == "3vot.js") fileBody = fileBody.replace("fileToCall + '.js?'", "'https://localhost:3000/" + app_name + "/' + fileToCall + '.js?'" );
    else fileBody = _3vot.replaceAll(fileBody, "*/assets", "https://localhost:3000/" + app_name + "/assets");

    res.set('Content-Type', mime.lookup(filePath) );

    res.send(fileBody);

  })
  .fail(function(err){
    Log.error(err);
    res.send( err, 500 );
  })
};

function checkApp(app_name){
  var deferred = Q.defer();
  process.nextTick(function(){
    try{
      app_package = require(Path.join(  process.cwd() , "apps", app_name, "package.json") );
      deferred.resolve(app_name)
    }catch(err){
      Log.error(err, "actions/server", 154)
      deferred.reject("App " + app_name + " Not found in ")
    } 
  });
  return deferred.promise; 
}

function buildApp(app_name){
  var deferred = Q.defer();

  Log.debug(app_name,"build app")

  AppBuild( app_name, "localhost", false, Server.domain )
  .then( function(){
    Server.lastBuild = Date.now();
    deferred.resolve(app_name);
  })
  .fail( function(err){ 
    Log.error(err, "actions/server", 164); 
    deferred.reject(err);
  });

  return deferred.promise;
};




module.exports = Server