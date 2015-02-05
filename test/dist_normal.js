process.chdir( "./test/fixtures/clay_normal" );

var fs = require("fs");
var test = require('tape');
var gulp = require("gulp");
var path = require("path")
var rimraf = require("rimraf")

var glog = require('gulp-api-log');
//glog(gulp);

var config = require("../clayconfig");

var build = require("../tasks/build")
var dist = require("../tasks/dist")

test('should build html, js, css, and assets in old setup', function (t) {
  t.plan(9);

  config.set("USER", { key: "demo", user_name: "clay" });

  config.set("ZIP_NAME", "test_clay_2")

  rimraf( config.get("dist.folder") , function(){
    t.equal( false,    fs.existsSync( config.localize( config.get("dist.folder") ) )  );

    gulp.task("BUILD_T_1", ['CLAY_ZIP'], function(){
    	t.equal(  true,   fs.existsSync( config.localize( config.get("dist.folder" ) )));
      t.equal(  true,   fs.existsSync( config.localize( config.get("dist.folder" ), "fonts" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("dist.folder" ), "images" )));  
      t.equal(  true,   fs.existsSync( config.localize( config.get("dist.folder" ), "css" )));  
      t.equal(  false,  fs.existsSync( config.localize( config.get("dist.folder" ), "sections" )));  
      t.equal(  false,  fs.existsSync( config.localize( config.get("dist.folder" ), "code" )));  
    
      var index  = fs.readFileSync( config.localize( config.get( "dist.folder" ), "index.html" ) , "utf-8" );

      t.equal( index.indexOf( "http://3vot.com/clay/test_clay_2" ) > -1, true );

	    var existsZip =  fs.existsSync( config.localize( config.get( "dist.folder" ),  config.get("ZIP_NAME") + ".zip" ) , "utf-8" );
     	
     	t.equal(  true,  existsZip );
    })

    gulp.start("BUILD_T_1");

  });

});


test('should upload app', function (t) {
  t.plan(1);

  config.set("USER", { key: "demo", user_name: "clay" });

  config.set("ZIP_NAME", config.get("app.name") + "_" + config.get("app.version") )

  rimraf( config.get("dist.folder") , function(){
    
    gulp.task("BUILD_T_1", ['CLAY_DIST'], function(){
      t.equal(  true,   true );
    })

    gulp.start("BUILD_T_1");

  });

});



