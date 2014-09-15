var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    sh = require('shelljs'),
    wiredep = require('wiredep').stream,
    source = require('vinyl-source-stream'),
    browserify = require('browserify');


var paths = {
  js: ['./www/**/*.js'],
  css: ['./www/**/*.less']
};

gulp.task('less', function() {
  gulp.src(paths.css)
    .pipe(less())
    .pipe(concat('./bundle.css'))
    .pipe(gulp.dest('./www/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.css, ['less']);
  gulp.watch(paths.js, ['browserify']);
});

gulp.task('bower', function() {
  bower.commands.install()
    .on('end', function() {
      gulp.src('./www/index.html')
        .pipe(wiredep({ devDependencies: true }))
        .pipe(gulp.dest('./www/'));
    })
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('browserify', function() {
  browserify('./www/app.js').bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./www/'))
})

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
