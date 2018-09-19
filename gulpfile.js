const chassis = require('./index.js')
const gulp = require('gulp')
const path = require('path')
const fs = require('fs-extra')

gulp.task('css', () => {
  return gulp.src('./test/main.css')
    .pipe(chassis({
      theme: path.resolve('./test/main.theme')
    }))
    .pipe(gulp.dest('./test/output'))
})

gulp.task('clean', (next) => fs.ensureDir('./test/output', next))

gulp.task('test', ['clean', 'css'])
