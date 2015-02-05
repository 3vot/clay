var gulp = require('gulp');
var path = require("path");
var chalk = require('chalk');

var request = require("superagent")

var source       = require('vinyl-source-stream');

var gutil = require('gulp-util');

var browserSync = require('browser-sync');

var changed    = require('gulp-changed');

var rename = require('gulp-rename');

var config = require("r2-config")
var localize = config.localize;


gulp.task('CLAY_SF_SERVER', ['3VOT_COPY_ASSETS'], function() {
  var buildFolder = config.get("build.folder");
  browserSync({
    server: {
      // src is included for use with sass source maps
      baseDir: [ config.get("build.folder") ],
      middleware: function (req, res, next) {
        if(req.url.indexOf("/validate") == 0 ) return res._send('<script>window.location ="' + config.get("VISUALFORCE_URL") + '";</script>');
        next();
      }
    },
    notify: false,
    https: true,
    startPath: "/validate?url="+config.get("VISUALFORCE_URL"),
    files: [
      config.get("build.folder") + "/**",
      "!"+config.get("build.folder") + "/*.js",
    ]
  });
});


gulp.task('CLAY_SERVER', ['CLAY_BROWSER'], function() {
  gulp.watch( config.get("build.src") + '/css/*.css', ['CLAY_CSS']);
  gulp.watch( config.get("build.src") + '/*.html', ['CLAY_HTML']);
  gulp.watch( config.get("ASSETS_GLOBS") , ['CLAY_ASSETS_i']);
});

gulp.task('CLAY_SF_WATCH', ['3VOT_BROWSER'], function() {
  gulp.watch( config.get("SRC_RELATIVE") + '/css/**', ['3VOT_CSS']);
  gulp.watch( config.get("SRC_RELATIVE") + '/*.html', ['CLAY_VISUALFORCE']);
  //gulp.watch( config.get("ASSETS_GLOBS") , ['CLAY_ASSETS_i']);
});


