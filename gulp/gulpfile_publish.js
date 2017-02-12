var version='1.0';//修改最新的版本号,每次加0.1
var gulp = require('gulp');
var include = require('gulp-file-include');
var replaceSrc = require('gulp-replace');
var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
// var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('img_compress', function() {
    return gulp.src('../local/version/img/**/*.+(jpg|jpeg|gif|png)')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            optimizationLevel: 7
        }))
        .pipe(gulp.dest('../publish/version'+version+'/dist/img'))
});

/* Watch JS For Changes */
gulp.task('js', function() {
    return gulp.src(['../local/version/js/**/*.js'])
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../publish/version'+version+'/dist/js'))
});

/* Watch CSS For Changes */
gulp.task('css', function () {
    return gulp.src('../local/version/css/**/*.css')
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('../publish/version'+version+'/dist/css'))
        ;
});

/* copy images files under /img/ over to under /dist/ and watch them for changes */
/* p - v20160317 */
gulp.task('img', function () {
    return gulp.src('../local/version/img/**/*.+(jpg|jpeg|gif|png)')
        .pipe(gulp.dest('../img_old'))
});

//* include
gulp.task('first_include', function() {
    gulp.src(['../local/**/*.html'])
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('../publish/html'));
});

// second_include
gulp.task('second_include', function() {
    gulp.src(['../publish/html/**'])
        .pipe(replaceSrc('http://localhost:8080', 'https://test.meixincn.com'))
        .pipe(replaceSrc('local/version/', 'local/version_'+ version+'/'))
        .pipe(gulp.dest('../publish/html'));
});


/* Watch Files For Changes */
gulp.task('watch', function() {
    gulp.watch('../local/version/css/**/*.css', ['css']);

    gulp.watch('../local/version/js/**/*.js', ['js']);

    gulp.watch('../local/**/*.html', ['first_include']);
});

gulp.task('default', ['img_compress', 'js', 'css', 'first_include']);
