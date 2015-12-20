var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var watchify = require('watchify');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback')
var notify = require("gulp-notify");

var opts = {
    appJs: './app/js/app.js',
    appFolder: './app',
    jsOutfile: 'bundle.js',
    jsOutFolder: './app/js'
};

// Save a reference to the `reload` method
var reload = browserSync.reload;
gulp.task('browserify', function(){
    var bundler = watchify(browserify(opts.appJs, watchify.args));
    bundler.transform(babelify);
    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', swallowError)
            .pipe(source(opts.jsOutfile))
            .pipe(gulp.dest(opts.jsOutFolder))
            .pipe(reload({stream:true}))
            .pipe(notify("Browser reloaded after watchify update!"));;
    }

    return rebundle();
});

function swallowError(error) {
    //If you want details of the error in the console
    console.log(error.toString());
    this.emit('end');
}

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: opts.appFolder,
      middleware: [historyApiFallback]
    }
  });
});

gulp.task('default', ['browser-sync', 'browserify'], function() {
});
