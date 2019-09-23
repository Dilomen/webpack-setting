const path = require('path')
const babelOption = require('./babel.config')
const package = require(path.resolve(process.cwd(), './package.json'))
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.NODE_ENV === "development"
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const webpack = require('webpack')
const { rules, devServer, output, plugins } = package.config
let option = {
  //process.cwd()返回运行当前脚本的工作目录的路径
  entry: [path.resolve(process.cwd(), './src/index.js')],
  output: {
    path: path.resolve(process.cwd(), './build'),
    filename: "[hash:8].js",
    ...output
  },
  resolve: {
    extensions: ['.js', '.jsx', 'ts', 'tsx']
  },
  devServer: {
    contentBase: './build',
    host: "127.0.0.1",
    port: '3002',
    inline: true,
    ...devServer
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    // 自动加载模块，而不必到处 import 或 require
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      PureComponent: ['react', 'PureComponent'],
      Component: ['react', 'Component']
    }),
    new MiniCssExtractPlugin({
      filename: '[hash:8].css',
      chunkFilename: '[id].css'
    }),
    ...plugins
  ],
  mode: "development",
  module: {
    rules: [{
      test: /\.scss$/,
      loaders: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[local]_[hash:5]",
          }
        }
      }]
    },
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        ...babelOption()
      }
    },
    {
      test: /\.(jpg|png|svg)$/,
      loader: ['file-loader']
    },
    {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: ["ts-loader"]
    },
    {
      enforce: "pre",
      test: /\.js$/,
      loader: "source-map-loader"
    },
    {
      test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000'
    },
    ...rules
    ]
  }
}
module.exports = option
