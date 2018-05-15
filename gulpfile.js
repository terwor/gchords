'use strict';

const gulp        = require('gulp');
const sass        = require('gulp-sass');
const browserSync = require('browser-sync');
const concat      = require('gulp-concat');
const uglify      = require('gulp-uglifyjs');
const cssnano     = require('gulp-cssnano');
const rename      = require('gulp-rename');
const del         = require('del');
const imgmin      = require('gulp-imagemin');
const pngquant    = require('imagemin-pngquant');
const cache       = require('gulp-cache');
const autoprefix  = require('gulp-autoprefixer');


gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefix([
        'last 15 versions',
        '> 1%',
        'ie 8',
        'ie 7'
    ],{
        cascade: true
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jqurey/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'] , function() {
    return gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('app/css'));
})

gulp.task('watch', ['browserSync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
    .pipe(cache(imgmin({
        interlaced: true,
        progressive: true,
        svgPlugins: [
            {
                removeVirewBox: false
            }
        ],
        use: [
            pngquant()
        ]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean','img', 'sass', 'scripts'], function() {
    let buildCSS = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'))

    let buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    let buildJS = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'))

    let buildHTML = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);