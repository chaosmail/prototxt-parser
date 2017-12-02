const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const ts = require('gulp-typescript');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const del = require('del');
const p = require('./package.json');

const config = {
  src: "./src",
  filename: p.name + ".js",
  dst: "./dist"
};

const tsProject = ts.createProject('tsconfig.json');

// Clean the output folder
gulp.task('clean', () => {
  return del([config.dst]);
});

// Bundle the project for the browser
gulp.task('browserify', () => {
  
  let b = browserify({
    standalone: 'prototxt-parser',
    extensions: '.ts'
  });

  return b.plugin('tsify')
    .add(config.src + '/index.ts')
    .bundle()
    .pipe(source(config.filename))
    .pipe(buffer())
    .pipe(gulp.dest(config.dst + '/browser'))
    .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulpIf('*.js', rename({suffix: '.min'})))
    .pipe(gulp.dest(config.dst + '/browser'));
});

// Compile the project for Node and Typescript
gulp.task('tsc', () => {

  return gulp.src([config.src + '/**/*.ts'])
    .pipe(tsProject())
    .pipe(gulp.dest(config.dst + '/node'));
});

gulp.task('build', (cb) => {
  return runSequence('clean', ['browserify', 'tsc'], cb);
});

gulp.task('default', ['browserify']);