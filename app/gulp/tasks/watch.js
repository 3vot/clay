/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
  gulp.watch('src/hbs/**', ['markup']);
  gulp.watch('src/css/**', ['sass']);
  gulp.watch(['src/images/**', '!src/images/map/**'], ['images']);
  gulp.watch('src/htdocs/**', ['markup']);
});