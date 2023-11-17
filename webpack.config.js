const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

const dists = ['dist-chrome', 'dist-firefox'];

module.exports = {
	entry: {
		'dist-chrome/bundle': './src/index.jsx',
		'dist-firefox/bundle': './src/index.jsx'
	},
	output: {
			filename: '[name].js',
			path: path.resolve(__dirname, './'),
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{from: "src/*.html", to: "dist-chrome/[name].html"},
				{from: "src/*.html", to: "dist-firefox/[name].html"},
				{from: "src/*.png", to: "dist-chrome/[name].png"},
				{from: "src/*.png", to: "dist-firefox/[name].png"},
				{ from: "src/background.js", to: "dist-chrome/" },
				{ from: "src/background.js", to: "dist-firefox/" },
				{ from: "src/manifest-chrome.json", to: 'dist-chrome/manifest.json'},
				{ from: "src/manifest-firefox.json", to: 'dist-firefox/manifest.json'},
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