const fs = require('fs')
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpackMerge = require("webpack-merge");
const WebpackChain = require('webpack-chain');
const commonOption = require("./webpack.common");
const { checkFileExist, createTemplete } = require("./util");
createTemplete();
let result = checkFileExist();

let prodDefaultOption = {
  // devtool: 'cheap-module-source-map',
  plugin: {
    CleanWebpackPlugin: {
      plugin: CleanWebpackPlugin
    },
    MiniCssExtractPlugin: {
      plugin: MiniCssExtractPlugin,
      args: [
        {
          filename: "[name].css",
          chunkFilename: "[name].css",
        }
      ]
    },
    HtmlWebpackPlugin: {
      plugin: HtmlWebpackPlugin,
      args: [
        {
          filename: "index.html",
          template: result
            ? path.resolve(process.cwd(), "./index.html")
            : path.resolve(__dirname, "./index.html"),
        }
      ]
    },
    UglifyJsPlugin: {
      plugin: UglifyJsPlugin,
      args: [{
        uglifyOptions: {
          warnings: false,
        },
        parallel: true,
      }]
    }
  },
  module: {
    rule: [
      {
        test: /\.s?[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "../" },
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]_[hash:5]",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: path.resolve(__dirname, "./postcss.config.js"),
              },
            },
          },
          {
            loader: "sass-loader",
          }
        ],
      },
    ],
  },
  mode: "production",
  // optimization: {
  //   // 合并CSS样式
  //   minimizer: [new OptimizeCSSAssetsPlugin({})],
  //   // 代码分割
  //   splitChunks: {
  //     chunks: 'all',
  //     minSize: 30000,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     automaticNameDelimiter: '~',
  //     name: true,
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10,
  //         filename: 'vendors.js'
  //       },
  //       default: {
  //         priority: -20,
  //         reuseExistingChunk: true,
  //         filename: 'common.js'
  //       }
  //     }
  //   }
  // }
}

let uniteOptions = webpackMerge(prodDefaultOption, commonOption)
console.log('uniteOptions ===>', uniteOptions)
// configureWebpack
let extraOption = {}
const sereinConfigPath = path.resolve(process.cwd(), './serein.config.js')
if (fs.existsSync(sereinConfigPath)) {
  const { configureWebpack } = require(sereinConfigPath)
  if (configureWebpack && (configureWebpack instanceof Function)) {
    extraOption = require(sereinConfigPath).configureWebpack(uniteOptions)
  } else {
    extraOption = require(sereinConfigPath).configureWebpack
  }
}

uniteOptions = webpackMerge(uniteOptions, extraOption)
// chainWebpack
const webpackChainOption = new WebpackChain()
webpackChainOption.merge(uniteOptions)
if (fs.existsSync(sereinConfigPath)) {
  const { chainWebpack } = require(sereinConfigPath)
  chainWebpack(webpackChainOption)
}
module.exports = webpackChainOption.toConfig();
