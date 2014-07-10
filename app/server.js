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
var rimraf = require("rimraf")
var Transform = require("./utils/transform")

var mime = require('mime');

var Server = {}
var Builder = require("3vot-cloud/utils/builder");
var WalkDir = require("3vot-cloud/utils/walk")
var AppBuild = require("3vot-cloud/app/build")

var Mock = require("./server_mock");

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

Mock(app);

app.get("/", function(req,res){
  res.send("<h1>Congratulations CLAY Local Server is Running</h1>");
});

app.get("/:app_name/", function(req, res) {
  var asset = req.params.asset;
  var app_name = req.params.app_name;
  var file = "index.html";
  return middleware(app_name, file, req,res)
});

app.get("/:app_name", function(req, res) {
  var app_name = req.params.app_name
  res.redirect("/" + app_name + "/")
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
  var filePath = Path.join(  process.cwd() , "apps", app_name, "assets", asset );
  var fileBody = Transform.readByType(filePath, "local", {app_name: app_name});
  res.set('Content-Type', mime.lookup(filePath));
  res.send(fileBody);
});

https.createServer(sslOptions, app).listen(app.get('port'), function(){
  console.info('3VOT Server running at:  https://' + Server.domain );
}); 


function middleware(app_name,file_name, req, res) {
  checkApp(app_name)
  .then(clearAppFolder)
  .then(function(){ return buildApp(app_name); })
  .then(function(){
    var filePath = Path.join(  process.cwd() , "apps", app_name, "app", file_name );
    var fileBody = Transform.readByType(filePath, "local", { app_name: app_name });
    res.set('Content-Type', mime.lookup(filePath));
    return res.send(fileBody);
  })
  .fail(function(err){
    res.send( err.stack || err.toString());
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

function clearAppFolder(app_name){
  var deferred = Q.defer();
  var path = Path.join( process.cwd(), 'apps', app_name, 'app' );
  rimraf(path, function(err){
    fs.mkdirSync(path);
    fs.mkdirSync( Path.join(path,"assets") );
    return deferred.resolve(app_name);
  })
  return deferred.promise;
}

function buildApp(app_name){
  var deferred = Q.defer();

  Log.debug(app_name,"build app")

  AppBuild( app_name, "localhost", false, Server.domain )
  .then( function(){
    //Server.lastBuild = Date.now();
    return deferred.resolve(app_name);
  })
  .fail( function(err){ 
    //Log.error(err, "actions/server", 164); 
    return deferred.reject(err);
  });

  return deferred.promise;
};

module.exports = Server