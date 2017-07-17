var webpack = require('webpack');
var Html = require('html-webpack-plugin');

module.exports = {
	entry:{
		main: __dirname+'/src/script/main.js',
		a: __dirname+'/src/script/a.js',
		b: __dirname+'/src/script/b.js',
		c: __dirname+'/src/script/c.js'
	},
	output:{
		path:__dirname+'/dist',
		filename: 'js/[name]-[chunkhash].js',
		publicPath: 'http://my.com' //用于上线地址
	},
	module: {
        loaders: [
          {
            test: /\.css$/,
          	loader: 'style-loader!css-loader'
          }
        ]
    },
    plugins: [
        new Html({
            filename: 'index.html',//生成的html文件
            template: __dirname+'/index.html',//index模板
            inject: false, //放在头部，body或不加这个选项默认放在body里，false
            title: 'this is index', // html标题获取参数
            chunks: ['main']
        }),
        new Html({
            filename: 'a.html',//生成的html文件
            template: __dirname+'/index.html',//index模板
            inject: false, //放在头部，body或不加这个选项默认放在body里，false
            title: 'this is a', // html标题获取参数
            chunks: ['main','a','c']
        }),
        new Html({
            filename: 'b.html',//生成的html文件
            template: __dirname+'/index.html',//index模板
            inject: 'body', //放在头部，body或不加这个选项默认放在body里，false
            title: 'this is b', // html标题获取参数
            excludeChunks: ['a','c']
        }),
        new Html({
            filename: 'c.html',//生成的html文件
            template: __dirname+'/index.html',//index模板
            inject: 'body', //放在头部，body或不加这个选项默认放在body里，false
            title: 'this is c', // html标题获取参数
            excludeChunks: ['a','b']
        })
    ]
}