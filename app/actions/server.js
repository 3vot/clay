var express = require('express');
var fs = require("fs");
var less = require("less");
var Path = require("path");
var http = require('http');
var https = require('https');
var url = require("url");
var prompt = require("prompt")
var _3vot = require("3vot")
var argv = require('optimist').argv;
var request = require("superagent")
var devDomain = null;

var Server = {}
var Builder = require("../utils/builder");
var Transform = require("../utils/transform")
var WalkDir = require("../utils/walk")
var AppBuild = require("./app_build")

var Log = require("../utils/log")

module.exports = Server;
Server.domain = "localhost:3000"
Server.ssl = true

Server.start = function(){

  var sslOptions = {
    key: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)), "..","..", 'ssl' , "server.key" )),
    cert: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)),"..","..", 'ssl' , "server.crt" )),
    ca: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)), "..","..",'ssl' , "ca.crt" )),
    requestCert: true,
    rejectUnauthorized: false
  };
  
  var app = express();    

  // all environments
  app.set('port', 3000);
  app.disable('etag');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  app.get("/", function(req,res){
    res.send("<h1>Congratulations 3VOT Local Server is Running</h1><h2>Now head to your app @ /YOURAPP</h2>");
  });

  app.get("/:app_name/assets/:folder/:asset", function(req, res) {
    var asset = req.params.asset;
    var app_name = req.params.app_name;
    var folder_name = req.params.folder;
    var filePath = Path.join(  process.cwd() , "apps", app_name, "app", "assets", folder_name, asset );
    res.sendfile(filePath);
  });

  app.get("/:app_name/assets/:asset", function(req, res) {
    var asset = req.params.asset;
    var app_name = req.params.app_name;
    var filePath = Path.join(  process.cwd() , "apps", app_name, "app", "assets", asset );
    res.sendfile(filePath);
  });

  app.get("/:app_name/:entry", function(req, res) {
    function sendEntry(req, res){
      res.setHeader('if-none-match' , 'no-match-for-this');
      var entry = req.params.entry;
      var app_name = req.params.app_name;
      var filePath = Path.join(  process.cwd() , "apps", app_name, "app", entry );
      res.sendfile(filePath);    
    }
    
    if ( Date.now() - ( Server.lastBuild || 0 ) < 5 * 1000 ){
      Log.debug("Entry was just build by html route, not building entry", "actions/server", 127)
      return sendEntry(req, res)
    }
    
    var app_name = req.params.app_name;
    AppBuild( app_name, "localhost", false, Server.domain )
    .then( function(){ 
      sendEntry(req,res);
    }).fail( function(err){ Log.error(err, "actions/server", 135); res.send( err.toString(), 500 ) });
    
  });

  app.get("/:app_name", function(req, res) {
    var app_package;
    var app_name = req.params.app_name
    try{
      app_package = require(Path.join(  process.cwd() , "apps", app_name, "package.json") );
    }catch(err){
      Log.error(err, "actions/server", 154)
      return res.send("App " + app_name + " Not found in " + profile)
    }

    AppBuild( app_name, "localhost", false, Server.domain )
    .then( function(){
      Server.lastBuild = Date.now();
      var filePath = Path.join(  process.cwd() , "apps", app_name, "app", "index.html");
      res.sendfile(filePath)
    })
    .fail( function(err){ Log.error(err, "actions/server", 164); res.send( err.toString(), 500 ) });

  });

  https.createServer(sslOptions, app).listen(app.get('port'), function(){
    console.info('3VOT Server running at:  https://' + Server.domain );
  }); 

}


