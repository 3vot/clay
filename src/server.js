var express = require('express');
var fs = require("fs");
var less = require("less");
var Path = require("path");
var http = require('http');
var url = require("url");
var prompt = require("prompt")
var _3vot = require("3vot")
var argv = require('optimist').argv;

var devDomain = null;

var Server = {}
var Builder = require("./builder");
var Transform = require("./transform")

module.exports = Server;

Server.prompt =  function(){
  prompt.start();
  prompt.get( [ { name: 'domain', description: 'Domain: ( If you are on nitrous.io type the preview domain with out http:// or trailing slashes / ) ' }], 
   function (err, result) {
     Server.startServer( result.domain  )
   }
  );
},

Server.startServer = function( domain, callback  ){
  Server.serverCallback = callback;
  
  var app = express();    
  var pck = require( Path.join( process.cwd(), "3vot.json" )  );
  var profile = pck.username;
  // all environments
  app.set('port', 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  app.get("/", function(req,res){
    res.send("<h1>Congratulations 3VOT Local Server is Running</h1><h2>Now head to your app @ /YOURORG/YOURAPP</h2>");
  });

  app.get("/" + profile  + "/:appName/assets/:asset", function(req, res) {
    var asset = req.params.asset;
    var appName = req.params.appName;
    var filePath = Path.join(  process.cwd() , "apps", appName, "app", "assets", asset );
    res.sendfile(filePath);
  });

  app.get("/" + profile  + "/dependencies/:name", function(req, res) {
    res.setHeader("Content-Type", "text/javascript");

    fs.readFile( Path.join( process.cwd(), "apps", "dependencies", req.params.name ) , 
      function(err, file){
        if(err){
          //get App Name From req.Host        

          var urlParts = req.headers.referer.split("/")
          var appName = ""
          if( urlParts[ urlParts.length -1 ] === "" ){
            appName = urlParts[ urlParts.length -2 ]
          }
          else{
            appName = urlParts[ urlParts.length -1 ]
          }
          
          return res.redirect("/" + profile + "/dependencies/" + appName +  "/build");
        }
        return res.send(file);    
      }
    );
  });

  app.get("/" + profile  + "/dependencies/:appName/build", 
    function(req, res) {
      res.setHeader("Content-Type", "text/javascript");
      var appName = req.params.appName
      Builder.buildDependency( appName )
      .then( 
        function( contents ){
          return res.send(contents);
        } 
      );
    }
  );

  app.get("/" + profile  + "/:appName/:device", function(req, res) {
    res.setHeader("Content-Type", "text/javascript");
    var device = req.params.device;
    var appName = req.params.appName;
    fs.readFile( Path.join(  process.cwd() , "apps", appName, "app", device) , 
      function(err, contents){
        if(err){
          res.status(500);
          return res.send(err);
        }
        res.send(contents)
      }
    );
  });

  app.get("/" + profile  + "/:appName", 
    function(req, res) {
      var appName = req.params.appName;
      pck = require( Path.join( process.cwd(), "apps", appName, "package.json" ) );
      Builder.buildApp( appName )
      .then( 
        function( html ){
          //Tranforming Index to Localhost
          html = Transform.transformToLocalhost(html, pck, domain);
          return res.send( html );
        } 
      ).fail( function(err){ res.send( err.toString() ) } );
    }
  );

  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    if(Server.serverCallback) Server.serverCallback();
  });
}
