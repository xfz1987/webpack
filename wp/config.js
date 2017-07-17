var webpack = require('webpack');
var Html = require('html-webpack-plugin');
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
	entry: __dirname+'/src/app.js',
	output:{
		path:__dirname+'/dist',
		filename: 'js/[name].boundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: path.resolve(__dirname,'src'),
				exclude: path.resolve(__dirname,'node_modules'),
				query: {
					presets: ['latest']
				}
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader?importLoaders=1!postcss-loader'
			},
			{
				test: /\.less$/,
				loader: 'style-loader!css-loader!postcss-loader!less-loader'
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(png|jpg|gif|svg|jpeg)$/,
				// loader: 'file-loader',
				loader: 'url-loader',
				query: {
					limit: 102400,
					name: 'image/[name]-[hash:5].[ext]'
				}
			}
		]
	},
	plugins: [
		new Html({
			filename: 'index.html',
			template: __dirname+'/index.html',
			inject: 'body'
		}),
		new webpack.LoaderOptionsPlugin({
    		options: {
    		  postcss: function () {
    		    return [autoprefixer];
    		  }
    		}
  		}),
  		new webpack.DefinePlugin({'process.env.NODE.ENV':"development"}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		contentBase: __dirname+'/dist',//本地服务器所加载的页面所在的目录
		inline: true,
		hot: true
	}
}