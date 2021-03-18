const { watch } = require('gulp');

function watchFiles(cb) {
  watch('./docs/views/**.ejs', generateHTML);
  watch('./src/css/**.css', generateCSS);
  watch([ './src/**/*.js', '!node_modules/**'], parallel(runLinter, runTests));
}

exports.watch = watchFiles;
