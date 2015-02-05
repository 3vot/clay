var browserSync = require('browser-sync');
var gulp        = require('gulp');

gulp.task('browserSync', ['build'], function() {
  browserSync({
    server: {
      // src is included for use with sass source maps
      baseDir: ['build', 'src']
    },
    notify: false,
    files: [
      // Watch everything in build
      "build/**",
      "!build/images/map/**",
      // Exclude sourcemap files
      "!build/**.map"
    ]
  });
});
