const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')
const commonOption = require('./webpack.common')
const { checkFileExist, createTemplete } = require('./util')
createTemplete()
let result = checkFileExist()
let option = merge({
  devtool: 'cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[hash:8].css',
      chunkFilename: '[id].css'
    }), 
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: result ? path.resolve(process.cwd(), './index.html') : path.resolve(__dirname, './index.html')
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
  ],
  module: {
     rules: [{
      test: /\.scss$/,
      loaders: [MiniCssExtractPlugin.loader, 'css-loader', {
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
      use: [MiniCssExtractPlugin.loader, {
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
  mode: 'production',
  optimization: {
    // 合并CSS样式
    minimizer: [new OptimizeCSSAssetsPlugin({})],
    // 代码分割
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename: 'vendors.js'
        },
        default: {
          priority: -20,
          reuseExistingChunk: true,
          filename: 'common.js'
        }
      }
    }
  }
}, commonOption)

module.exports = option