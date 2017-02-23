// var version='1.0';//修改最新的版本号,每次加0.1
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
        .pipe(gulp.dest('../dev/version/dist/img'))
});

/* Watch JS For Changes */
gulp.task('js', function() {
    return gulp.src(['../local/version/js/**/*.js','!../local/version/js/common.js','!../local/version/js/channel.js'])
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('../dev/version/dist/js'))
});

/* Watch CSS For Changes */
gulp.task('css', function () {
    return gulp.src('../local/version/css/**/*.css')
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('../dev/version/dist/css'))
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
    gulp.src(['../local/**/*.html','../local/includes/*.html'])
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('../dev/html'));
});

// second_include
gulp.task('second_include', function() {
    gulp.src(['../dev/html/**'])
        // .pipe(replaceSrc('http://localhost:8080', 'http://192.168.1.109:8080'))
        .pipe(replaceSrc('http://localhost:8080', 'http://zion.meixincn.com'))
        .pipe(gulp.dest('../dev/html'));
});


/* Watch Files For Changes */
gulp.task('watch', function() {
    // livereload.listen();
    // Trigger a live reload on any css changes
    gulp.watch('../local/version/css/**/*.css', ['css']);

    gulp.watch('../local/version/js/**/*.js', ['js']);
    // Trigger a live reload on any Django template changes

    gulp.watch('../local/**/*.html', ['first_include']);
});

gulp.task('default', ['img_compress', 'js', 'css','first_include']);
