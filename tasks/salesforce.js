
var Path     =  require("path")
var fs       =  require("fs");
var Q        =  require("q");
var crypto   =  require('crypto');
var request  =  require("superagent");
var replace  =  require('gulp-replace');
var revall   =  require('gulp-rev-all');
var gulp     =  require("gulp");
var jsforce  =  require("jsforce");

var es       =  require("event-stream");


gulp.task( "CLAY_VISUALFORCE", [ "CLAY_LOGIN" ], function( cb ){
  var name = process.env.NAME + "_dev";
  var url  = process.env.INSTANCE_URL + "/services/data/v30.0/sobjects/ApexPage/Name/" + name; 
  var page = fs.readFileSync( Path.join( process.env.DIST_FOLDER, "index.html" ), "utf-8" );

  process.env.VISUALFORCE_URL = process.env.INSTANCE_URL + "/apex/" + name;

  body = {
    Markup : page,
    ControllerType : 3,
    MasterLabel: name,
    ApiVersion: "30.0"
  }

  var req = request.patch( url )
  .type( "application/json" )
  .set( 'Authorization', 'Bearer ' + process.env.ACCESS_TOKEN )
  .send( body )
  .end( function( err, res ){
    console.log( err );
    if( err ) return cb( err );
    if( res.body[0] && res.body[0].errorCode ) return cb( "Salesforce.com rejected the upsert of a Visualforce Page with the HTML we send, it's posibly due to unvalid HTML. Please review your template files. ERROR: " + res.body[0].message );
    if( res.body.success == false || res.body.errorCode ) cb( "ERROR: " + JSON.stringify( res.body ) );
    cb();
  })
})


gulp.task( "CLAY_STATIC_RESOURCE", [ "CLAY_LOGIN","3VOT_ZIP" ], function( cb ){
  var zip   = fs.readFileSync( process.env.ZIP_PATH );
  var zip64 = new Buffer(zip).toString('base64');
  var url   = process.env.SF_SESSION + '/services/data/v30.0/tooling/sobjects/StaticResource/'
  var name  = process.env.ZIP_NAME

  var conn  = new jsforce.Connection({
    accessToken: process.env.ACCESS_TOKEN,
    instanceUrl: process.env.INSTANCE_URL
  });

  var namespace = ""
  if( process.env.NAMEspace ) namespace = "build.namespace__"

  var fullNames = [{
    fullName:     namespace + name,
    content:      zip64,
    contentType: "application/zip", 
    cacheControl: "Public"  ,
  }];

  conn.metadata.upsert( 'StaticResource', fullNames, function( err, results ) {
    return cb( null, results );
    if( err ) cb( err );
  });
})

