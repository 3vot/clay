var gulp        = require('gulp');
var awspublish  = require( 'gulp-awspublish' );
var rename      = require("gulp-rename")
var p           = require('../../package.json');

var dotenv = require("dotenv");
dotenv.load();

gulp.task('s3', ["images"], function() {
  
  var publisher = awspublish.create({ 
    key: process.env["AccessKeyID"],
    secret: process.env["SecretAccessKey"], 
    bucket: process.env["S3Bucket"]
  });

  // define custom headers
  var headers = { 'Cache-Control': 'max-age=100, no-transform, public' };

  return gulp.src( "./build/images/**" )
    
    .pipe(publisher.publish(headers, { force: true }))
    .pipe(awspublish.reporter());  
});


