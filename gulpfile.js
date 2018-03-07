/**
 * gulpfile.js
 *
 * Runs a collection of tasks for this project.
 *
 * Usage:
 * 'gulp'      Builds the dist archives (usually for a new release).
 * 'gulp dist' Same as 'gulp'.
 */





/**
 * Configurations.
 *
 * Preliminary setup work.
 */

// Gulp configuration.
var fs          = require('fs');

var gulp        = require('gulp');
var plugins     = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var chalk       = require('chalk');

var pkg         = require('./package.json');
var dirs        = pkg['soshal'].directories;


// Configurations for plumber.
var plumber = {

    options: {
        errorHandler: errorHandler
    }

};


// Configurations for Sass.
var sass = {

    compile: {

        options: {
            outputStyle: 'compressed'
        }

    }
    
}

// Configurations for Autoprefixer.
var autoprefixer = {

    options: ['last 2 versions', 'ie 9']

};


/**
 * Error handler.
 *
 * Takes any gulp errors and outputs them to the terminal.
 *
 * @param object err The error object.
 */
function errorHandler(err) {

    console.log('');
    console.log('  ' + chalk.red('[') + 'error' + chalk.red(']') + ' \u2219 ' + chalk.red('in ') + err.plugin);
    console.log('  ' + chalk.red('[') + 'error' + chalk.red(']') + ' \u2219 ' + err.lineNumber + ':' + err.message);
    console.log('  ' + chalk.red('[') + 'error' + chalk.red(']') + ' \u2219 ' + err.fileName);
    console.log('');

    this.emit('end');

}

/**
 * Logs custom messages to the console.
 *
 * @param  string environment The environment the task is running in.
 * @param  string subject     The subject of the message.
 * @param  string message     The remainder of the message.
 */
function log(environment, subject, message) {

    console.log('');

    if (environment === 'dev') {

        console.log('  ' + chalk.cyan('[') + environment + chalk.cyan(']') + ' · ' + chalk.cyan(subject) + ' ' + message);

    } else if (environment === 'dist') {

        console.log('  ' + chalk.magenta('[') + environment + chalk.magenta(']') + ' · ' + chalk.magenta(subject) + ' ' + message);

    } else if (environment === 'test') {

        console.log('  ' + chalk.yellow('[') + environment + chalk.yellow(']') + ' · ' + chalk.yellow(subject) + ' ' + message);

    }

    console.log('');

}


/**
 * Development tasks.
 *
 * A collection of tasks that assist during development.
 */

// Main dev watcher.
gulp.task('dev:watch', function() {

    log('dev', 'watching', 'project files');

    // Let livereload listen for changes.
    plugins.livereload.listen();

    gulp.watch(dirs.sass + '/**/*.scss', ['dev:sass']);

    gulp.watch([
        dirs.js + '/**/*.js', '!' + dirs.js + '/scripts.min.js'], ['dev:js-compile']
    );

});


// Runs a sequence of Sass tasks.
gulp.task('dev:sass', function(done) {

    runSequence(
        'dev:sass-compile',
    done);

});


// Parse Sass and autoprefix the generated CSS.
gulp.task('dev:sass-compile', function() {

    log('dev', 'compiling', 'Sass files');

    return gulp.src(dirs.sass + '/style.scss')
        .pipe(plugins.plumber(plumber.options))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass(sass.compile.options))
        .pipe(plugins.autoprefixer(autoprefixer.options))
        .pipe(gulp.dest('./public/dist'))
        .pipe(plugins.sourcemaps.write('./maps'))
        .pipe(gulp.dest('./public/dist'))
        .pipe(plugins.livereload());

});

// Concat and minify JavaScripts.
gulp.task('dev:js-compile', function() {

    log('dev', 'compiling', 'JS files');

    return gulp.src([
            '!' + dirs.js + '/vendor/jquery-3.2.1.min.js',
            dirs.js + '/vendor/modernizr-3.5.0.min.js',
            dirs.js + '/vendor/*.js',
            dirs.js + '/scripts.js'
        ])
        .pipe(plugins.plumber(plumber.options))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.concat('scripts.min.js'))
        .pipe(gulp.dest('./public/dist'))
        .pipe(plugins.livereload());

});

/**
 * Gulp commands.
 *
 * Expose certain tasks or sequences to the CLI.
 */
gulp.task('default', ['dev:watch']);