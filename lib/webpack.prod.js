const fs = require('fs')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { merge: webpackMerge } = require('webpack-merge')
const commonOption = require('./webpack.common')
const result = fs.existsSync(path.resolve(process.cwd(), './index.html'))
const { getLibAbsPath, getAbsPath } = require('./utils')
const { postcssLoader, cssModuleLoader } = require('./common')
const prodDefaultOption = {
  mode: 'production',
  devtool: false,
  plugin: {
    CleanWebpackPlugin: {
      plugin: CleanWebpackPlugin
    },
    MiniCssExtractPlugin: {
      plugin: MiniCssExtractPlugin,
      args: [
        {
          filename: '[contenthash].css',
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
          cssModuleLoader,
          postcssLoader
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      {
        plugin: OptimizeCSSAssetsPlugin,
        args: [{}]
      },
      {
        plugin: TerserPlugin,
        args: [{
          extractComments: false, // 是否将注释提取到一个文件
          parallel: true // 是否启用多进程来提升打包速度
          // minify: (file, sourceMap) => {
          //   const uglifyJsOptions = {}
          //   return require('uglify-js').minify(file, uglifyJsOptions)
          // }
        }]
      },
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      name: 'chunk',
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {
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
  },
}

const uniteOptions = webpackMerge(prodDefaultOption, commonOption)
module.exports = (commandConfig) =>
  require('./mergeOptions')(uniteOptions, commandConfig)
