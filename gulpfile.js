const chassis = require('./index.js')
const gulp = require('gulp')
const del = require('del')
const fs = require('fs-extra')

gulp.task('css', () => {
  return gulp.src('./test/main.css')
    .pipe(chassis())
    .pipe(gulp.dest('./test/output'))
})

gulp.task('clean', (next) => fs.ensureDir('./test/output', next))

gulp.task('test', ['clean', 'css'])
