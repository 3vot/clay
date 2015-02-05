var gulp = require('gulp');

var render  = require('gulp-handlebars-render');


var data     = require('../../data.json');

gulp.task('hbs', function () {
	gulp.src('./src/hbs/*.hbs')
	.pipe(render( data ))
	.pipe(gulp.dest('build'))
});