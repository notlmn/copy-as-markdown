const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	stats: 'errors-only',
	entry: {
		'copy-as-markdown': './source/copy-as-markdown.js',
		'background': './source/background.js',
	},
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: '[name].js',
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'manifest.json',
					context: 'source',
				},
				{
					from: 'copy-as-markdown.png',
					context: 'source',
				},
			],
		}),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2 // eslint-disable-line camelcase
					}
				}
			})
		]
	}
};
