var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var jsonminify = require('gulp-jsonminify');
var revall = require('gulp-rev-all');
var clean = require('gulp-clean');
var p = require('../../package.json');

gulp.task('clean', ['build'], function() {
    return gulp.src('./dist', {read: false})
                .pipe(clean());
});

gulp.task('copy', ['clean'], function() {
    return gulp.src('./build/**')
    .pipe(revall({
        ignore: [/^\/favicon.ico$/g, /^\/index.html/g, /^\/captions/g, /^\/images\/static/g, /^\/sounds/g, /^\/images\/social/g, /^\/images\/map\/dist/g],
        //prefix: global.previewUrl || p.previewUrl
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['copy'], function() {

    gulp.src(['./dist/**/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist'));

    gulp.src('./dist/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));

    return gulp.src('./dist/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});