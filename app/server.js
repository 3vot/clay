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

var Packs = require("3vot-cloud/utils/packs")


var Mock = require("./server_mock");

var Q = require("q")

var Log = require("3vot-cloud/utils/log")

Server.domain = "localhost:3000"
Server.ssl = true;
Server.lastBuild=0;


var sslOptions = {
  key: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)), "..", 'ssl' , "server.key" )),
  cert: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)),"..", 'ssl' , "server.crt" )),
  ca: fs.readFileSync( Path.join(Path.dirname(fs.realpathSync(__filename)), "..",'ssl' , "ca.crt" )),
  requestCert: true,
  rejectUnauthorized: false
};

var app = express();    

// all environments
app.set('port', 3000);
app.disable('etag');
app.enable('strict routing');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

Mock(app);

app.get("/validate", function(req, res) {
  res.send('<script>window.location ="' + req.query.app + '";</script>')
});


app.get("/*.js", function(req, res) {

  middleware(req,res,function(options){
      var file = req.params[0] + ".js";
      var filePath = Path.join(  process.cwd(), options.package.threevot.distFolder, file );

      fs.stat(filePath, function(err,stats){
        if(err){ Log.debug(err,"server",73); return res.send(404); }
        if(!stats.isFile()) return res.send(404);
        var fileBody = Transform.readByType(filePath, "local", {} )
        res.set('Content-Type', mime.lookup(filePath));
        res.send(fileBody);
      });
  });
});


app.get("/*", function(req, res) {
  var file = req.params[0];
  var filePath = Path.join(  process.cwd(), file );

  fs.stat(filePath, function(err,stats){
    if(err){ Log.debug(err,"server",73); return res.send(404); }
    if(!stats.isFile()) return res.send(404);
    var fileBody = Transform.readByType(filePath, "local", {} )
    res.set('Content-Type', mime.lookup(filePath));
    res.send(fileBody);
  });
});

https.createServer(sslOptions, app).listen(app.get('port'), function(){
  console.info('3VOT Server running at:  https://' + Server.domain );
}); 

function middleware(req, res, callback) {
  var options;

  var time = new Date().getTime();
    console.log(time - Server.lastBuild)

  if(time - Server.lastBuild < (1000 * 15) ){ 
    Log.info("not building " + req.params[0],"server"); 
    return callback( {package: Packs.package({},false)} ); 
  }

  Packs.get({}, false)
  .then(function(result){
    Server.lastBuild = time;
    options=result; 
    return buildApp(result);
  })
  .then(function(){
    return callback(options);
  })
  .fail(function(err){
    res.send( err.stack || err.toString());
  })
};

function buildApp(options){
  var deferred = Q.defer();
  Log.debug(options.package.name,"server",95)

  AppBuild( options )
  .then( function(){
    return deferred.resolve(options.package.name);
  })
  .fail( function(err){ 
    return deferred.reject(err);
  });

  return deferred.promise;
};
module.exports = Server