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

var devDomain = null;

var Server = {}
var Builder = require("../utils/builder");
var Transform = require("../utils/transform")
var WalkDir = require("../utils/walk")
var AppBuild = require("./app_build")

module.exports = Server;

Server.prompt =  function(){
  prompt.start();
  prompt.get( [ 
    { name: 'domain', description: 'Nitrous Domain: Type your nitrous.io preview domain, or enter to continue ) ' } ], 
   function (err, result) {
     //result.domain = result.domain || ""
     //result.domain = result.domain.replace("http://", "")
     //result.domain = result.domain.replace("https://", "")
     //if( result.domain.slice(-1) == "/") result.domain = result.domain.slice(0, - 1);
     Server.domain = result.domain;
     Server.startServer( result.domain )
   });
},

Server.startServer = function( domain ,callback  ){
  Server.serverCallback = callback;

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

  app.use(function(req,res,next) {
    if (!/https/.test(req.protocol)){
       res.redirect("https://" + req.headers.host + req.url);
    } else {
       return next();
    } 
  });

  app.get("/", function(req,res){
    res.send("<h1>Congratulations 3VOT Local Server is Running</h1><h2>Now head to your app @ /YOURORG/YOURAPP</h2>");
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
      res.setHeader("Content-Type", "text/javascript");
      var entry = req.params.entry;
      var app_name = req.params.app_name;
      var filePath = Path.join(  process.cwd() , "apps", app_name, "app", entry );
      res.sendfile(filePath);    
    }
    
    var app_name = req.params.app_name;
    AppBuild( app_name, "localhost", false, domain )
    .then( function(){ 
      sendEntry(req,res);
    }).fail( function(err){ console.log(err); res.send( err.toString(), 500 ) });
    
  });

  app.get("/" + profile  + "/:app_name", 
    function(req, res) {
      var html = ""
      var app_name = req.params.app_name;
      var pck;
      var _3vot;
      
      try{
      pck = require(Path.join(  process.cwd() , "apps", app_name, "package.json") );
      _3vot = require(Path.join(  process.cwd() , "3vot.json" ));
      }catch(err){
        console.log(err);
        return res.send("App " + app_name + " Not found in " + profile)
      }
      
      Builder.buildHtml ( pck , _3vot.user_name  )
      .then( function(html){
        res.set('Content-Type', 'text/html'); 
        var html = Transform["localhost"](html, _3vot.user_name, app_name, domain );        
        res.send(html)
      })
      
      .fail( function(err){ res.send( err.toString() ) });
    }
  );

  https.createServer(sslOptions, app).listen(app.get('port'), function(){
    console.log('3VOT Server @ https://localhost:' + app.get('port'));
    if(Server.serverCallback) Server.serverCallback();
  }); 
  
}

function cleanDomain(domain){
  
}


