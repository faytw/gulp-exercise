var gulp = require('gulp');
// css
var compass = require('gulp-compass');
var sass = require('gulp-ruby-sass');
var cleanCss = require('gulp-clean-css');
//js
var uglify = require('gulp-uglify');
//html
var pug = require('gulp-pug');
var htmlPrettify = require('gulp-html-prettify');
//監聽
var plumber = require('gulp-plumber');
//通知
var notify = require('gulp-notify');
//調整 gulp顯示設定
var util = require('gulp-util');
//建立版本號，清除緩存
var revAppend = require('gulp-rev-append');
//瀏覽器同步設定
var browserSync = require('browser-sync');
var reload = browserSync.reload;
//檔案處理
var rename = require('gulp-rename');
var concat = require('gulp-concat');
//清除資料夾內容
var del = require('del');


//設定檔案路徑
const dirs = {
    src: 'src',
    dest: 'dist'
};

const viewPath = {
    src: `${dirs.src}/view/**/*.pug`,
    dest: `${dirs.dest}`
}

const stylePath = {
    src: `${dirs.src}/style/**/*`,
    src_folder: `${dirs.src}/style`,
    temp: `${dirs.src}/temp`,
    dest: `${dirs.dest}/css`
};

const scriptPath = {
    src: `${dirs.src}/script/**/*.js`,
    dest: `${dirs.dest}/js`
};

const imagePath = {
    src: `${dirs.src}/image/*`,
    dest: `${dirs.dest}/image`
};

const vendorPath = {
    src: `${dirs.src}/vendor/**/*`,
    dest: `${dirs.dest}/vendor`
};


//錯誤處理
var buildOnError = function(error) {
    console.log('****************');
    notify.onError({
        sound: 'pop'
    })(error);

    util.log(util.colors.brown(error.message));
    console.log('****************');
    browserSync.notify(error.message, 5000);

    return notify(error.message);
};


//開發中,編譯 pug檔案
gulp.task('pug:dev', function() {
    var all = gulp.src(viewPath.src)
        .pipe(plumber({
            errorHandler: buildOnError
        }))
        .pipe(pug({
            locals: {
                dev: true,
            },
            pretty: true
        }).on('error', util.log))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(gulp.dest(viewPath.dest))
        .pipe(browserSync.stream());

    return all;
});

//編譯 pug檔案
gulp.task('pug:prod', function() {
    var all = gulp.src(viewPath.src)
        .pipe(plumber({
            errorHandler: buildOnError
        }))
        .pipe(pug({
            locals: {
                prod: true,
            },
            pretty: true
        }).on('error', util.log))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(gulp.dest(viewPath.dest))

    return all;
});


//編譯 sass檔案
gulp.task('compass', function() {
    var stream = gulp.src(stylePath.src)
        .pipe(compass({
            css: stylePath.temp,
            sass: stylePath.src_folder,
            image: imagePath.dest,
            style: 'expanded',
            sourcemap: false
        })).on('error', function(error) {
            console.log('////////////////');
            util.log(util.colors.blue(error.message));
            console.log('////////////////');
            browserSync.notify(error.message, 5000);
            stream.end();
        })
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(stylePath.dest))
        .pipe(browserSync.stream());
    return stream;
});


//將 dist/css中的 css進行壓縮
gulp.task('compress-css', ['compass'], function() {
    gulp.src(stylePath.dest + '/*.css')
        .pipe(cleanCss())
        .pipe(gulp.dest(stylePath.dest));
});


//先合併js,再壓縮輸出至 dist/js
gulp.task('compress-js', function() {
    return gulp.src(scriptPath.src)
        .pipe(concat('app.min.js'))
        .pipe(uglify().on('error', util.log))
        .pipe(gulp.dest(scriptPath.dest))
        .pipe(browserSync.stream());
});


// 複製 image後送到 dist/image
gulp.task('image', function() {
    gulp.src(imagePath.src)
        .pipe(gulp.dest(imagePath.dest));
});


// 複製 vendor後送到 dist/vendor
gulp.task('vendor', function() {
    gulp.src(vendorPath.src)
        .pipe(gulp.dest(vendorPath.dest));
});


//監看，加上 browser-sync
gulp.task('watch', function() {
    browserSync.init({
        port: 3060,
        open: false,
        watchOptions: {
            debounceDelay: 1000
        },
        //加上檔案路徑
        server: {
            baseDir: "D:/Code/my-gulp-project/dist"
        }
    });

    gulp.watch(viewPath.src, ['pug:dev']);
    gulp.watch(stylePath.src, ['compass']);
    gulp.watch(scriptPath.src, ['compress-js']);
});


//清空 dist/view,dist/css,src/temp,dist/js,dist/image
gulp.task('clean', function() {
    return del([
        viewPath.dest + '/*.html',
        stylePath.dest + '/**/*',
        stylePath.temp + '/**/*',
        scriptPath.dest + '/**/*',
        imagePath.dest + '/**/*'
    ]);
});


// dist中的 html 都加上 URL版本
gulp.task('rev-append', ['build:prod'], function() {
    gulp.src(viewPath.dest + '/*.html')
        .pipe(revAppend())
        .pipe(gulp.dest(viewPath.dest));
});


// ************************************************* //
//開發中
gulp.task('build:dev', ['pug:dev', 'compass', 'compress-js', 'image', 'vendor']);

//開發完成
gulp.task('build:prod', ['pug:prod', 'compass', 'compress-css', 'compress-js', 'image', 'vendor']);

//預設 npm run dev
//基本編譯，加上 browser-sync
gulp.task('default', ['build:dev', 'watch']);

//發佈 npm run build
//清空資料夾，重新編譯dist, URL加上版本號
gulp.task('prod', ['clean', 'build:prod', 'rev-append']);