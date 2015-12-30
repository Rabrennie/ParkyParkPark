var gulp        = require('gulp');
var copy        = require('gulp-copy');
var gutil       = require('gulp-util');
var watch       = require('gulp-watch');
var ghPages     = require('gulp-gh-pages');
var source      = require('vinyl-source-stream');
var del         = require('del');
var path        = require('path');
var runSeq      = require('run-sequence');
var babelify    = require('babelify');
var watchify    = require('watchify');
var exorcist    = require('exorcist');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();

function bundle(shouldWatch) {
    // Input file.
    var bundler = browserify('./app/js/app.js', { debug: shouldWatch });

    // Babel transform
    bundler.transform(babelify.configure({
        sourceMapRelative: 'app/js',
        presets: ["es2015"]
    }));

    function rebundle() {
        return bundler.bundle()
            .on('error', function (err) {
                gutil.log(err.message);
                browserSync.notify("Browserify Error!");
                this.emit("end");
            })
            .pipe(shouldWatch ? exorcist('/dist/js/bundle.js.map') : gutil.noop())
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./dist/js'))
            .pipe(browserSync.stream({once: true}));
    }

    if(shouldWatch) {
      bundler = watchify(bundler);

      // On updates recompile
      bundler.on('update', function(files) {
        gutil.log('Changed files: ' + files.map(path.relative.bind(path, process.cwd())).join(', '));
        gutil.log('Recompiling JS...');
        rebundle();
      });
    }

    bundler.on('log', function(msg) {
      gutil.log(msg)
    });

    gutil.log('Compiling JS...');
    return rebundle();
}

function buildCSS(shouldWatch) {
    return gulp.src('app/css/style.css')
      .pipe(shouldWatch ? watch('app/css/style.css') : gutil.noop())
      .pipe(gulp.dest('dist/css'));
}

function buildHTML(shouldWatch) {
    return gulp.src('app/index.html')
        .pipe(shouldWatch ? watch('app/index.html') : gutil.noop())
        .pipe(gulp.dest('dist'));
}

gulp.task('clean', function() {
  return del(['dist']);
})

gulp.task('watch:css', function() {
  return buildCSS(true);
});

gulp.task('watch:html', function() {
    return buildHTML(true);
});

gulp.task('watch:js', function () {
    return bundle(true);
});

gulp.task('watch:all', ['watch:css', 'watch:html', 'watch:js']);

gulp.task('build:css', function() {
  return buildCSS(false);
});

gulp.task('build:html', function() {
  return buildHTML(false);
});

gulp.task('build:js', function() {
  return bundle(false);
});

gulp.task('build:all', ['build:css', 'build:html', 'build:js']);

gulp.task('copy:assets', function() {
    return gulp.src('app/assets/**/*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('deploy', function() {
    return gulp.src(`dist/**/*`, { base: 'dist' })
        .pipe(ghPages());
});

gulp.task('browser', function() {
    browserSync.init({
        server: './dist'
    });
});

gulp.task('build', function(cb) {
  return runSeq('clean', ['build:all', 'copy:assets'])
})

/**
 * First bundle, then serve from the ./app directory
 */
gulp.task('default', ['watch:all', 'copy:assets', 'browser']);
