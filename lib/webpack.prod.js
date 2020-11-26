const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpackMerge = require('webpack-merge')
const commonOption = require('./webpack.common')
const result = fs.existsSync(path.resolve(process.cwd(), './index.html'))

const prodDefaultOption = {
  // devtool: 'cheap-module-source-map',
  plugin: {
    CleanWebpackPlugin: {
      plugin: CleanWebpackPlugin
    },
    MiniCssExtractPlugin: {
      plugin: MiniCssExtractPlugin,
      args: [
        {
          filename: '[name].css',
          chunkFilename: '[name].css'
        }
      ]
    },
    HtmlWebpackPlugin: {
      plugin: HtmlWebpackPlugin,
      args: [
        {
          filename: 'index.html',
          template: result
            ? path.resolve(process.cwd(), './index.html')
            : path.resolve(__dirname, './index.html')
        }
      ]
    },
    UglifyJsPlugin: {
      plugin: UglifyJsPlugin,
      args: [
        {
          uglifyOptions: {
            warnings: false
          },
          parallel: true
        }
      ]
    }
    // BundleAnalyzerPlugin: {
    //   plugin: BundleAnalyzerPlugin
    // },
  },
  module: {
    rule: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' }
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, './postcss.config.js')
              }
            }
          }
        ]
      }
    ]
  },
  mode: 'production',
  optimization: {
    usedExports: true,
    // 合并CSS样式
    minimizer: [
      {
        plugin: OptimizeCSSAssetsPlugin,
        args: [{}]
      }
    ],
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
}

const uniteOptions = webpackMerge(prodDefaultOption, commonOption)
module.exports = (configRelactivePath) =>
  require('./mergeOptions')(uniteOptions, configRelactivePath)
