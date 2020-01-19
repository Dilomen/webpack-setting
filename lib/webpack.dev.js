const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonOption = require('./webpack.common')
const {  createTemplete } = require('./util')

createTemplete()
let option = merge({
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
          config: {
            path: path.resolve(__dirname, './postcss.config.js')
          }
        }
      }, 'sass-loader']
    },
    {
      test: /\.css$/,
      use: ['style-loader', {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[local]_[hash:5]",
          }
        }
      }, {
        loader: 'postcss-loader',
        options: {
          config: {
            path: path.resolve(__dirname, 'postcss.config.js')
          }
        }
      }]
    }]
  },
  mode: 'development'
}, commonOption)
module.exports = option