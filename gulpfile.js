const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const rimraf = require('rimraf');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const openBrowser = false;
const resources = {
  clean: 'dist/',
  build: {
    fonts: 'dist/fonts/',
    images: 'dist/images/',
    main: 'dist/',
  },
  src: {
    fonts: 'assets/fonts/*.*',
    images: 'assets/images/**/*.{ico,gif,jpg,png,svg,webm}',
    scripts: 'src/scripts/**/*.js',
    styles: 'src/styles/index.scss',
    templates: 'src/templates/*.pug',
  },
  watch: {
    fonts: 'assets/fonts/*.*',
    images: 'assets/images/**/*.{ico,gif,jpg,png,svg,webm}',
    scripts: 'src/scripts/**/*.js',
    styles: 'src/styles/**/*.scss',
    templates: 'src/templates/**/*.pug',
  },
};

// Browser sync task
gulp.task('browser-sync', () => {
  browserSync.init({
    open: openBrowser,
    server: {
      baseDir: resources.build.main,
    },
  });

  gulp.watch(`${resources.build.main}/**/*`).on('change', browserSync.reload);
});

// Compile scripts task
gulp.task('scripts', () => {
  return gulp
    .src(resources.src.scripts)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(resources.build.main));
});

// Compile styles task
gulp.task('styles', () => {
  return gulp
    .src(resources.src.styles)
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest(resources.build.main));
});

// Compile templates task
gulp.task('templates', () => {
  return gulp
    .src(resources.src.templates)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(resources.build.main));
});

// Build clean up task
gulp.task('clean', (callback) => rimraf(resources.build.main, callback));

// Copy fonts task
gulp.task('fonts', () =>
  gulp.src(resources.src.fonts).pipe(gulp.dest(resources.build.fonts))
);

// Copy images task
gulp.task('images', () =>
  gulp.src(resources.src.images).pipe(gulp.dest(resources.build.images))
);

// Parallel copy tasks
gulp.task('copy', gulp.parallel('fonts', 'images'));

// Watchers task
gulp.task('watch', () => {
  gulp.watch(resources.watch.fonts, ['fonts']);
  gulp.watch(resources.watch.images, ['images']);
  gulp.watch(resources.watch.scripts, ['scripts']);
  gulp.watch(resources.watch.styles, ['styles']);
  gulp.watch(resources.watch.templates, ['templates']);
});

// Default task
gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('copy', 'scripts', 'styles', 'templates'),
    gulp.parallel('watch', 'browser-sync')
  )
);
