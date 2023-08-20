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
				{ from: "src/background.js"},
				{ from: "src/manifest.json"},
				{ from: "src/popup.html"},
				{ from: "src/popup_disabled.html"},
				{ from: "src/icon_32.png"},
				{ from: "src/icon_32_disabled.png"},
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