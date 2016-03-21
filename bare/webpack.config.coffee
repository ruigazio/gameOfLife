path = require 'path'
webpack = require 'webpack'

module.exports =
	entry: './src/main.coffee'
	devtool: 'sourcemap'
	debug: true
	contentBase: path.join __dirname, 'dist'
	output:
		path: path.join __dirname, 'dist'
		publicPath: 'dist/'
		filename: 'bundle.js'
		#chunkFilename: '[chunkhash].js'

	module:
		loaders: [
			{ test: /\.coffee$/, loader: 'coffee-loader' }
			, { test: /\.js/, loader: 'babel-loader' }
		]
