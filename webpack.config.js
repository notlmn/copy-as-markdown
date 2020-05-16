const fs = require('fs');
const path = require('path');

const SizePlugin = require('size-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = {
	devtool: 'sourcemap',
	stats: 'errors-only',
	entry: {
		'copy-as-markdown': './source/copy-as-markdown.js'
	},
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: '[name].js'
	},
	plugins: [
		new SizePlugin(),
		new DefinePlugin({
			__INJECTIBLE_CODE__: JSON.stringify(fs.readFileSync('./source/injectible-code.js', 'utf-8'))
		}),
		new CopyWebpackPlugin([
			{
				from: '**/*',
				context: 'source',
				ignore: ['*.js']
			},
			{
				from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
			}
		])
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
