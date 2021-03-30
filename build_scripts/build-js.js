const gulp = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default

gulp.src([
  "./src/js/*.js"
])
.pipe(concat('bundle.min.js'))
// Minify to the max
.pipe(uglify({ mangle: { toplevel: true } }))
.pipe(gulp.dest('./public/js'))
