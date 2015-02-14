var gulp       =   require( 'gulp' );
var path       =   require( 'path' );
var chalk      =   require( 'chalk');
var request    =   require( 'superagent' );
var gutil      =   require( 'gulp-util' );


var PluginError  = gutil.PluginError;

var awspublish =   require( 'gulp-awspublish' );
var rename     =   require( 'gulp-rename' );
var zip        =   require( 'gulp-zip' );
var revall     =   require('gulp-rev-all');
var Request    =   require('superagent');
var open       =   require('open');
var fs         =   require("fs");

gulp.task('CLAY_GET_KEY', function(cb) {

  Request.get( 'https://unzipper.herokuapp.com/login' )
  .set( 'Accept', 'application/json' )
  .type( 'application/json' )
  .query( 'dev_code='+ process.env.CLAY_CODE )
  .end( function( res ){
    if( res.status > 200 ) return cb( res.text );
    process.env.AWS_ACCESS_KEY =  res.body.Aws_Keys.Credentials.AccessKeyId
    process.env.AWS_ACCESS_TOKEN = res.body.Aws_Keys.Credentials.SecretAccessKey
    process.env.AWS_BUCKET = '3votzips' 
    process.env.CLAY_USER =  res.body 
    cb();  
  });
});

gulp.task( 'CLAY_ZIP', [ 'CLAY_GET_KEY' ] , function () {
  return gulp.src( [ process.env.DIST_FOLDER + '/**' ], { base: process.env.DIST_FOLDER   , cwd: process.cwd() })
  .pipe(zip( process.env.ZIP_NAME + '.zip' ))
  .pipe( gulp.dest( process.env.ZIP_FOLDER ));
});


gulp.task('CLAY_UPLOAD', [ 'CLAY_ZIP', 'CLAY_GET_KEY' ], function() {
  var headers = { 'Cache-Control': 'max-age=1, no-transform, public' };

  var publisher = awspublish.create({ 
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_ACCESS_TOKEN,
    bucket: process.env.AWS_BUCKET
  });


  //if( !fs.existSync( localize( config.get( 'ZIP_PATH' ) ) ) ){
    gutil.log( gutil.colors.red(  "Dist Folder not found at " + process.env.ZIP_PATH ) );
  //}

  return gulp.src( process.env.ZIP_PATH )
  .pipe(rename(function ( path ) {
    path.dirname = '/' + process.env.ZIP_NAME
    path.basename = process.env.ZIP_NAME
  }))

  .pipe(publisher.publish(headers))
  .pipe(awspublish.reporter());
});


gulp.task( 'CLAY_DIST', [ 'CLAY_UPLOAD' ], function(cb){
  //request.get('http://localhost:3000/unzip')

  request.get('http://unzipper.herokuapp.com/unzip')
  .query({ bucket: process.env.AWS_BUCKET })
  .query({ key:  process.env.ZIP_NAME + '/' + process.env.ZIP_NAME  +'.zip' })
  .end( function( res ){
    if(res.status > 200){
      console.dir( res.error )
      console.error( res.status )
      console.dir( res.body || res.test )
      throw res.body || res.text || res.error || res.status
    }
    gutil.log( gutil.colors.green( 'Publication Complete' ) );
    
    open( "http://" + process.env.ZIP_NAME + ".3votapp.com" );
    return cb();
  })
});
