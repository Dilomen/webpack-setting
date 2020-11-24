const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpackMerge = require("webpack-merge");
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

const uniteOptions = webpackMerge(prodDefaultOption, commonOption)
module.exports = require('./mergeOptions')(uniteOptions);