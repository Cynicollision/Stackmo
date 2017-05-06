var gulp = require('gulp'),
    cleanCompiledTypeScript = require('gulp-clean-compiled-typescript');
 
gulp.task('clean', function () {
    return gulp.src('./src/**/*.ts')
        .pipe(cleanCompiledTypeScript());
});