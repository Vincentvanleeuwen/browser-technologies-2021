const gulp = require('gulp')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Location of where to get CSS
gulp.src([
  "./src/css/*.css"
])
// Bundle to index.css
.pipe(concat('index.css'))
// Minify CSS
.pipe(cleanCSS())
// Parse
.pipe(autoprefixer({
  cascade: false
}))
// Location of index.css
.pipe(gulp.dest('./public/css'))
