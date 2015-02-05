var gulp = require('gulp');

var render  = require('gulp-handlebars-render');

var data     = require('../../data.json');

gulp.task('markup', ["hbs"] , function() {
  return gulp.src('src/htdocs/**')
    .pipe(gulp.dest('build'));
});



