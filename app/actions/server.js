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

Server.prompt =  function(){
  prompt.start();
  prompt.get( [ 
    { name: 'domain', description: 'Domain: The domain where you will run the app from ( enter for localhost:3000 ) ' } , 
    { name: 'ssl', description: 'SSL: (y/n) Run server in HTTPS with SSL? ' } ],
   function (err, result) {
     result.domain = result.domain || "localhost:3000"
     result.domain = result.domain.replace("https://", "")
     result.domain = result.domain.replace("http://", "")
     if( result.domain.slice(-1) == "/") result.domain = result.domain.slice(0, - 1);
     Server.domain = result.domain;
     Server.ssl = result.ssl || false
     Server.startServer()
   });
},

Server.startServer = function(){

  var sslOptions = {
    key: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)), "..","..", 'ssl' , "server.key" )),
    cert: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)),"..","..", 'ssl' , "server.crt" )),
    ca: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)), "..","..",'ssl' , "ca.crt" )),
    requestCert: true,
    rejectUnauthorized: false
  };
  
  var app = express();    
  var pck = require( Path.join( process.cwd(), "3vot.json" )  );
  var profile = pck.user_name;
  // all environments
  app.set('port', 3000);
  app.disable('etag');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  app.get("/", function(req,res){
    res.send("<h1>Congratulations 3VOT Local Server is Running</h1><h2>Now head to your app @ /YOURORG/YOURAPP</h2>");
  });

  app.get("/" + profile  + "/:app_name/assets/:folder/:asset", function(req, res) {
    var asset = req.params.asset;
    var app_name = req.params.app_name;
    var folder_name = req.params.folder;
    var filePath = Path.join(  process.cwd() , "apps", app_name, "app", "assets", folder_name, asset );
    res.sendfile(filePath);
  });

  app.get("/" + profile  + "/:app_name/assets/:asset", function(req, res) {
    var asset = req.params.asset;
    var app_name = req.params.app_name;
    var filePath = Path.join(  process.cwd() , "apps", app_name, "app", "assets", asset );
    res.sendfile(filePath);
  });

  app.get("/" + profile  + "/dependencies/:name", function(req, res) {
    res.setHeader("Content-Type", "text/javascript");

    fs.readFile( Path.join( process.cwd(), "apps", "dependencies", req.params.name ) , 
      function(err, file){
        if(err){
          //get App Name From req.Host
          var urlParts = req.headers.referer.split("/")
          var app_name = ""
          if( urlParts[ urlParts.length -1 ] === "" ){
            app_name = urlParts[ urlParts.length -2 ]
          }
          else{
            app_name = urlParts[ urlParts.length -1 ]
          }
          
          return res.redirect("/" + profile + "/dependencies/" + app_name +  "/build");
        }
        return res.send(file);    
      }
    );
  });

  app.get("/" + profile  + "/dependencies/:app_name/build", 
    function(req, res) {
      res.setHeader("Content-Type", "text/javascript");
      var app_name = req.params.app_name
      Builder.buildDependency( app_name )
      .then( 
        function( contents ){
          return res.send(contents);
        } 
      );
    }
  );

  app.get("/" + profile  + "/:app_name/:entry", function(req, res) {
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

  // Route for Main App, did this to simplify tranforms. Could also request via domain, but hack is worst
  app.get("/" + profile  + "/stores.json", function(req, res) {
    request.get("http://3vot.com/" + profile  + "/stores.json").end( function(err, httpResponse){
      if(err) return res.send(500, err)
      if(res.status >= 400) return res.send(500, res.text )
      res.send( httpResponse.body )
    })
  });

  app.get("/" + profile  + "/:app_name", function(req, res) {
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

  if(Server.ssl){
    https.createServer(sslOptions, app).listen(app.get('port'), function(){
      console.info('3VOT Server running at:  https://' + Server.domain + ":" + app.get('port'));
    }); 
  }
  
  else{
    http.createServer(app).listen(app.get('port'), function(){
      console.info('3VOT Server running at: http://' + Server.domain + ":" + app.get('port'));
    });
  } 
  
}


