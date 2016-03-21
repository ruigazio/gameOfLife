gulp             = require 'gulp'
gutil            = require 'gulp-util'
del              = require 'del'
gulpWebpack      = require 'gulp-webpack'
webpack          = require 'webpack'
concat           = require 'gulp-concat'
webpackDevServer = require "webpack-dev-server"
cleanCSS         = require 'gulp-clean-css'
runSequence      = require 'run-sequence'

gulp.task 'default', ['webpack-dev-server']

gulp.task 'clean', ->
	del [ 'dist/**/*' ]

gulp.task 'build', (cb) ->
	runSequence 'clean', ['html','cssMinified', 'js'], cb

gulp.task 'js', ->
	gulp.src 'src/main.coffee'
		.pipe gulpWebpack require './webpack.config.dist.coffee'
		.pipe gulp.dest 'dist/'

gulp.task 'cssMinified', ->
	gulp.src '../common/*.css'
		.pipe concat "bundle.css"
		.pipe cleanCSS()
		.pipe gulp.dest 'dist/'

gulp.task 'html', ->
	gulp.src 'src/*.html'
		.pipe gulp.dest 'dist/'

gulp.task 'css', ->
	gulp.src '../common/*.css'
		.pipe concat "bundle.css"
		.pipe gulp.dest 'dist/'

gulp.task "webpack-dev-server", ['css', 'html'], ->
	myConfig = require './webpack.config.coffee'
	gulp.watch ["src/**/*.css"], ['css']
	gulp.watch ["src/**/*.html"], ['html']
	new webpackDevServer webpack(myConfig),
		publicPath: "/" + myConfig.output.publicPath,
		stats:
			colors: true
	.listen 8003, "localhost", (err) ->
		if err then throw new gutil.PluginError "webpack-dev-server", err
		gutil.log "[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html"
