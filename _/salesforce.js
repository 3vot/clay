var Path    = require("path")
var fs      = require("fs");
var Q       = require("q");
var crypto  = require('crypto');
var request = require("superagent");

var replace = require('gulp-replace');
var revall  = require('gulp-rev-all');

var gulp    = require("gulp");
var jsforce = require("jsforce");
var config  = require("r2-config");
var es      = require("event-stream");

gulp.task( 'CLAY_STATIC_RESOURCE_HTML', function() { 
  return gulp.src([ config.get("build.src") + '/*.html'], { cwd: process.cwd() })      
  .pipe( visualforceHTML({ name: config.get("ZIP_NAME") }) )
  .pipe( gulp.dest( config.get("build.folder") ))
});


gulp.task('CLAY_LOCAL_HTML', function() {
  gulp.src([ config.get("build.src") + '/*.html'], { cwd: process.cwd() })      
  .pipe(replace( /{3vot}\//g, config.get("PREFIX")))
  .pipe(replace( /{ROOT}/g, config.get("PREFIX")))
  .pipe(replace( /<\/head>/g, '<script>window.clay = { path: "https://localhost:3000" }</script></head>' ))
  .pipe(revall({
    ignore: [ /^\/favicon.ico$/g ],
    transformFilename: function (file, hash) {
      var ext = Path.extname(file.path);
      return Path.basename(file.path, ext) + ext;
    },
    prefix: config.get("PREFIX"),
    quiet: true
    }))
  .pipe( gulp.dest( config.get("build.folder") ));
});


gulp.task( "CLAY_VISUALFORCE", [ "CLAY_LOGIN" ], function( cb ){
  var name = config.get( "app.name" ) + "_dev";
  var url  = config.get( "SF_SESSION" ).instance_url + "/services/data/v30.0/sobjects/ApexPage/Name/" + name; 
  var page = fs.readFileSync( Path.join( config.get( "build.folder" ), "index.html" ), "utf-8" );

  config.set( "VISUALFORCE_URL", config.get( "SF_SESSION" ).instance_url + "/apex/" + name);

  body = {
    Markup : page,
    ControllerType : 3,
    MasterLabel: name,
    ApiVersion: "30.0"
  }

  var req = request.patch( url )
  .type( "application/json" )
  .set( 'Authorization', 'Bearer ' + config.get( "SF_SESSION" ).access_token )
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
  var zip   = fs.readFileSync( config.get("ZIP_PATH") );
  var zip64 = new Buffer(zip).toString('base64');
  var url   = config.get("SF_SESSION") + '/services/data/v30.0/tooling/sobjects/StaticResource/'
  var name  = config.get("ZIP_NAME")

  var conn  = new jsforce.Connection({
    accessToken: config.get( "SF_SESSION" ).access_token,
    instanceUrl: config.get( "SF_SESSION" ).instance_url
  });

  var namespace = ""
  if( config.get("build.namespace") ) namespace = "build.namespace__"

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