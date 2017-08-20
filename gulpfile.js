var gulp = require('gulp');
var copy = require('gulp-copy');
var del = require('del');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCompiledTypeScript = require('gulp-clean-compiled-typescript');
 
gulp.task('clean', function () {
    return del(['build','dist']);
});

gulp.task('minify', function () {

    return gulp.src('dist/game.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
})

gulp.task('pack', function () {
    var viewTask = gulp.src('view/**/*').pipe(gulp.dest('build/view'));
    var resourcesTask = gulp.src('resources/**/*').pipe(gulp.dest('build/resources'));
    var gameTask = gulp.src(['dist/game.min.js']).pipe(gulp.dest('build/dist'))

    return [viewTask, resourcesTask, gameTask];
});

gulp.task('copy-android', function () {

    return gulp
        .src(['./build/**/*'])
        .pipe(copy('./android/vastdroid/app/src/main/assets', {}));
});