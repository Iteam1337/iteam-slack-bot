var gulp         = require('gulp');
var mocha        = require('gulp-mocha');
var nodemon      = require('gulp-nodemon');

//
// Tests
// --------------------------------------------------
gulp.task('test', function () {
  return gulp.src(['test/**/*.js'])
    .pipe(mocha({ reporter:'spec' }));
});

//
// Server
// --------------------------------------------------
gulp.task('nodemon', function () {
  nodemon({
    script: 'bot.js',
    ext: 'html js',
    ignore: [],
    stdout: true
  })
  .on('restart', function () {
    // console.log('restarted!')
  });
});

//
// Watch and task runners
// --------------------------------------------------
gulp.task('watch', function () {
  gulp.watch(['bot.js', 'services/**/*.js','test/**/*.js'], [
    'test']);
});

gulp.task('default', [
  'test',
  'nodemon',
  'watch'
]);