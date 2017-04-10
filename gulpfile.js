
// Node Plugins
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');

// CSS
gulp.task('css', function () {
	gulp.src('_dev/css/**/j-video.css')
	.pipe(rename({suffix: '.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('_dist/css'))
});

// JS
gulp.task('js', function() {
    return gulp.src('_dev/js/**/j-video.js')
    .pipe(concat('j-video.js'))
    .pipe(gulp.dest('_dev/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('_dist/js'));
});

// Clean
gulp.task('clean', function() {
	del(['_dist/css', '_dist/js'])
});

// Default
gulp.task('default', ['clean'], function() {
    gulp.start('clean', 'css', 'js');
});

// Watch
gulp.task('watch', function() {
	gulp.watch('_dev/css/**/style.css', ['css']);
	gulp.watch('_dev/js/**/scripts.js', ['js']);

});