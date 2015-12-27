var gulp        = require('gulp');
var copy        = require('gulp-copy');
var gutil       = require('gulp-util');
var watch       = require('gulp-watch');
var ghPages     = require('gulp-gh-pages');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var watchify    = require('watchify');
var exorcist    = require('exorcist');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();

// Input file.
watchify.args.debug = true;
var bundler = watchify(browserify('./app/js/app.js', watchify.args));

// Babel transform
bundler.transform(babelify.configure({
    sourceMapRelative: 'app/js',
    presets: ["es2015"]
}));

// On updates recompile
bundler.on('update', bundle);

function bundle() {

    gutil.log('Compiling JS...');

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(exorcist('./dist/js/bundle.js.map'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream({once: true}));
}

gulp.task('watch:css', function() {
    return gulp.src('app/css/style.css')
        .pipe(watch('app/css/style.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch:html', function() {
    return gulp.src('app/index.html')
        .pipe(watch('app/index.html'))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:assets', function() {
    return gulp.src('app/assets/**/*')
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('deploy', function() {
    return gulp.src(`dist/**/*`, { base: 'dist' })
        .pipe(ghPages());
});

/**
 * Gulp task alias
 */
gulp.task('bundle', function () {
    return bundle();
});

gulp.task('watch:all', ['watch:css', 'watch:html']);

gulp.task('browser', function() {
    browserSync.init({
        server: './dist'
    });
});

/**
 * First bundle, then serve from the ./app directory
 */
gulp.task('default', ['watch:all', 'copy:assets', 'bundle', 'browser']);
