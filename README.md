### 安裝 gulp 

##### 在全域安裝 gulp
```npm install -g gulp```

##### 在專案底下安裝 gulp
```npm install --save-dev gulp```


### 建立一個 gulpfile.js 

##### 1.引用 gulp plugin 
	- 檔案最上方的 require 的都用 var 來建立變數
		- gulp-uglify (壓縮js檔案)
		- gulp-concat (合併檔案)
		- gulp-pug 
		- gulp-compass
		- gulp-ruby-sass
		- gulp-clean-css (壓縮css檔案)
		- gulp-plumber (保持監聽，注意順序，執行在尚未壓縮時)
		- gulp-html-prettify
		- gulp-rename (重新命名檔案)
		- gulp-rev-append (頁面引用URL加上版本號)
		- gulp-notify (處理通知)
		- gulp-util (提供在gulp常用方法)
		- browser-sync
		- del (node原生模組，刪除文件或資料夾)

##### 2.檔案路徑設定可以用 const

##### 3.指定任務來分別編譯 pug 和 sass 檔案

##### 4.指定任務來複製圖片和套件內容

##### 5.開發時要同步監看，與 browser-sync 搭配

##### 6.指定 gulp 任務執行順序
