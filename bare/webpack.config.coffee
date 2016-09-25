path = require 'path'

module.exports =
	watch: true
	entry: './src/main.coffee'
	devtool: 'sourcemap'
	debug: true
	output:
		path: path.join __dirname, 'dist'
		publicPath: '/'
		filename: 'bundle.js'
		#chunkFilename: '[chunkhash].js'

	module:
		loaders: [
			{ test: /\.coffee$/, loader: 'coffee-loader' }
			, { test: /\.js/, loader: 'babel-loader' }
		]
