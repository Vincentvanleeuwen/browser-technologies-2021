const gulp = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default

// Where to get the Javascript from
gulp.src([
  "./src/js/*.js"
])
// Bundle to bundle.min.js
.pipe(concat('bundle.min.js'))
// Minify to the max
.pipe(uglify({ mangle: { toplevel: true } }))
// Location for bundle.min.js
.pipe(gulp.dest('./public/js'))
