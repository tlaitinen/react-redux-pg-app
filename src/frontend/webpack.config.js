'use strict';

var path = require('path')
  , webpack = require('webpack')
  , HtmlWebpackPlugin = require('html-webpack-plugin');

var proxySettings = {
  '/api/*': {
    target: 'http://localhost:3000'
  }
};
module.exports = {
  entry: "./index.tsx",
  output: {
    path: path.resolve('../../dist/frontend'),
    filename: '[chunkhash].js',
    publicPath: process.env.PUBLIC_PATH || '/'
  },
  node: {
    tls: 'empty',
    dns: 'empty',
    net: 'empty',
    fs: 'empty',
    pg: 'empty',
    'pg-native': 'empty'
  },
  module: {
    rules: [
      { test: /\.css$/,  loader: "style-loader!css-loader" },
      {
      test: /\.less$/,
      loader: "style-loader!css-loader!less-loader"
      },
     	{
        test: /\.tsx?$/,
        loader: [
          'ts-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: [
					'babel-loader'
					],
        exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "style-loader" // creates style nodes from JS strings
					}, {
					loader: "css-loader" // translates CSS into CommonJS
					}, {
					loader: "sass-loader" // compiles Sass to CSS
					}
			  ]
      }, 
      {
        test: /\.(png|gif|woff|woff2|eot|ttf|svg)($|\?v\=)/,
        loader: 'url-loader?limi=100000',
        exclude: /react-flags/
      },
      {
        test: /\.jpg$/,
        loaders: [
          'file-loader?' + JSON.stringify({ hash: 'sha512', digest: 'hex', name: '[hash].[ext]' }),
          'image-webpack-loader'
        ]
      },
      {
        test: /\.po$/,
        loader: 'json-loader!po-loader?format=jed1.x'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.js', '.json'],
    alias: {
      'pg-native': path.join(__dirname, 'aliases/pg-native.js'),
      'pg-promise': path.join(__dirname, 'aliases/pg-promise.js')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"' + process.env.NODE_ENV + '"'
      }
    }),
    new HtmlWebpackPlugin({
      title: 'React Redux Sample App',
      filename: 'index.html',
      favicon: './resources/icons/favicon.ico'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fi|en/)
  ],
  devServer: {
    historyApiFallback: {
      index: '/'
    },
    proxy: proxySettings,
    contentBase: path.resolve('static'),
    publicPath: '/'

	}
};
