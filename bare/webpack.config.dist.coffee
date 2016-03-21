webpack = require 'webpack'
module.exports =
	entry: './src/main.coffee'
	output:
		filename: 'bundle.js'

	module:
		loaders: [
			{ test: /\.coffee$/, loader: 'coffee-loader' }
			,{ test: /\.js/, loader: 'babel-loader' }
		]

	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
