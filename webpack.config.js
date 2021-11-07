const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "src/manifest.json"},
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.jsx$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}

};