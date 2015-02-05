process.chdir( "./test/fixtures/clay_normal" );

var fs = require("fs");
var test = require('tape');
var gulp = require("gulp");
var path = require("path")
var rimraf = require("rimraf")

var glog = require('gulp-api-log');
//glog(gulp);

var build = require("../tasks/build")

test('should build html, js, css, and assets for dist', function (t) {
  t.plan(9);

  var config = require("../clayconfig");

    gulp.task("BUILD_T_1", ['CLAY_BUILD'], function(){
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder") )));
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"fonts" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"images" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"css","index.css" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"index.html" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"index.js" )));  
      t.equal(  false,  fs.existsSync( config.localize( config.get("build.folder"),"sections" )));  
      t.equal(  false,  fs.existsSync( config.localize( config.get("build.folder"),"code" )));  
    
      var index  = fs.readFileSync( config.localize( config.get("build.folder"),"index.html" ) , "utf-8" );

      t.equal( index.indexOf("location.href") > -1, true );
    })

    gulp.start("BUILD_T_1");

});

test('should build html, js, css, and assets for server', function (t) {
  t.plan(9);

  var config = require("../clayconfig");
  config.set("PREFIX", "http://localhost:3000" )

    gulp.task("BUILD_T_1", ['CLAY_BUILD'], function(){
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder") )));
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"fonts" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"images" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"css","index.css" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"index.html" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("build.folder"),"index.js" )));  
      t.equal(  false,  fs.existsSync( config.localize( config.get("build.folder"),"sections" )));  
      t.equal(  false,  fs.existsSync( config.localize( config.get("build.folder"),"code" )));  
    
      var index  = fs.readFileSync( config.localize( config.get("build.folder"),"index.html" ), "utf-8" );

      t.equal( index.indexOf("http://localhost:3000") > -1, true );
    })

    gulp.start("BUILD_T_1");
});


