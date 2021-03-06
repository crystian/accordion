const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	entry: {
		app: ['@babel/polyfill', './src/index.js']
	},
	stats: {
		colors: true
	},
	devServer: {
		open: false,
		headers: {
			// 'Access-Control-Allow-Origin': 'localhost:*',
		}
	},
	devtool: 'inline-source-map',
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new CopyWebpackPlugin([
			{ from: './src/data.json' }
		])
	],
	module: {
		rules: [
			{
				test: /\.html$/,
				use: ['html-loader']
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							esModule: false
							// name: '[name].[ext]',
							// outputPath: 'img/',
							// publicPath: 'img/'
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: [
					/node_modules/
				],
				use: [
					{
						loader: 'babel-loader',
						options: {
							'presets': ['@babel/preset-env'],
							'plugins': ['@babel/plugin-proposal-class-properties']
						}
					},
					{
						loader: 'istanbul-instrumenter-loader',
						options: {
							esModules: true
						}
					}
				]
			},
			{
				test: /\.css$/,
				exclude: /node_modules(?!([\/\\])normalize\.css)/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.s([ac])ss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	}
};
