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

