var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    sh = require('shelljs'),
    wiredep = require('wiredep').stream;

var paths = {
  js: ['./www/**/*.js'],
  css: ['./www/**/*.less']
};

gulp.task('less', function() {
  gulp.src(paths.css)
    .pipe(less())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./www/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.css, ['less']);
});

gulp.task('bower', function() {
  bower.commands.install()
    .on('end', function() {
      gulp.src('www/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('www'));
    })
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('install', ['git-check', 'bower']);

gulp.task('default');
