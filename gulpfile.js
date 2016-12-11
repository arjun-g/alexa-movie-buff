const gulp = require('gulp'),
      zip = require('gulp-zip'),
      install = require("gulp-install"),
      del = require('del')

gulp.task('package', ['npm'], () => {
    return gulp.src(['tmp/node_modules/**/**', 'tmp/libs/**', 'tmp/index.js'], { base: './tmp' })
           .pipe(zip('movie-buff.zip'))
           .pipe(gulp.dest('dist'))
})

gulp.task('clean', () => {
    return del(['tmp', 'dist'])
})

gulp.task('copy', ['clean'], () => {
    return gulp.src(['libs/**', 'index.js', 'package.json'], { base: '.' })
           .pipe(gulp.dest('tmp'))
})

gulp.task('npm', ['copy'], () => {
    return gulp.src('tmp/package.json')
           .pipe(install())
})

