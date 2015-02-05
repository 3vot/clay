
var gulp = require('gulp');

	var inliner = require('html-inline')
var concat = require('concat-stream');

	var fs = require("fs");

gulp.task('inline', function () {
  
	var inline = inliner({ basedir: process.cwd() + '/build' , ignoreImages: true });
    var r = fs.createReadStream( process.cwd() + '/src/hbs/index.hbs');
    r.pipe(inline).pipe(concat(function (body) {
       fs.writeFileSync(  process.cwd() + '/inline/index.html', body.toString('utf8')  )
    }));

});
