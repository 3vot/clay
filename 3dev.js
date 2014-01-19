var express = require('express');
var fs = require("fs");
var less = require("less");
var _3builder = require("./3builder");
var Path = require("path");
var http = require('http');
var url = require("url");

module.exports = {
  
  startServer: function(){

    var app = express();
    // all environments
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    app.get("/rodco/:appName/assets/:asset", function(req, res) {
      res.setHeader("Content-Type", "text-javascript");
      var asset = req.params.asset;
      var appName = req.params.appName;
      fs.readFile( Path.join(  process.cwd() , "apps", appName, "app", "assets", asset ) , 
        function(err, contents){
          if(err){
            res.status(500);
            return res.send(err);
          }
          res.send(contents)
        }
      );
    });

    app.get("/dependencies/:name", function(req, res) {
      res.setHeader("Content-Type", "text-javascript");

      fs.readFile( Path.join( process.cwd(), "apps", "dependencies", req.params.name ) , 
        function(err, file){
          if(err){
            //get App Name From req.Host          
            var urlParts = req.headers.referer.split("/")
            return res.redirect("/rodco/dependency/" + urlParts[ urlParts.length -1 ] +  "/build");
          }
          return res.send(file);    
        }
      );
    });

    app.get('/dependencies/:app/build', 
      function(req, res) {
        res.setHeader("Content-Type", "text-javascript");
        var appName = req.params.name
        _3builder.buildDependency( appName )
        .then( 
          function( contents ){
            return res.send(contents);
          } 
        );
      }
    );

    app.get("/rodco/:appName/:device", function(req, res) {
      res.setHeader("Content-Type", "text-javascript");
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

    app.get('/rodco/:appName', 
      function(req, res) {
        res.setHeader("Content-Type", "text-javascript");
        var baseDir = process.cwd();
        var appName = req.params.appName;
        pck = fs.readFileSync( Path.join( baseDir, "apps", appName, "package.json"  ), "utf-8"  );
        _3builder.buildApp( appName )
        .then( 
          function( html ){
            html = html.replace("3vot.domain = 'demo.3vot.com';","3vot.domain = 'localhost:"+ app.get('port') +"';")
            return res.send( html );
          } 
        ).fail( function(error){  res.send(arguments) } );
      }
    );

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
  }
};