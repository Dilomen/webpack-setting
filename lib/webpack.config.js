const path = require('path')
const babelOption = require('./babel.config')
const package = require(path.resolve(process.cwd(), './package.json'))
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const isDev = process.env.NODE_ENV === "development"
const { checkFileExist } = require('./util')
const webpack = require('webpack')
const { config = {} } = package
const { rules = [], devServer = {}, output = {}, plugins = [], fileEntry = "", providePlugin = {}, alias = {} } = config

// 将package.json中config的alias的属性值（字符串）转为js
let aliasPathName
Object.keys(alias).map(key => {
  try {
    aliasPathName = eval(alias[key])
  } catch (e) {
    throw new Error("alias的属性值出错", e)
  }
  checkFileExist(aliasPathName)
  alias[key] = aliasPathName
})

checkFileExist(fileEntry || './src/index.js')
// fs.exists(path.resolve(process.cwd(), fileEntry || './src/index.jsx'), (isExist) => {
//   if (!isExist) {
//     throw new Errow('src下没有index.js文件,请在package.json设置config的fileEntry属性导入文件路径，从根目录开始，如config: {fileEntry: "./src/index.jsx"}')
//   }
// })
// /\.\/src\/index.[jt]sx?/

let option = {
  //process.cwd()返回运行当前脚本的工作目录的路径
  entry: [path.resolve(process.cwd(), fileEntry || "./src/index.js")],
  output: {
    path: path.resolve(process.cwd(), './build'),
    filename: "[hash:8].js",
    ...output
  },
  resolve: {
    extensions: ['.js', '.jsx', 'ts', 'tsx'],
    alias: {
      'src': path.resolve(process.cwd(), "./src"),
      'components': path.resolve(process.cwd(), "./src/components"),
      'utils': path.resolve(process.cwd(), "./src/utils"),
      'assets': path.resolve(process.cwd(), "./src/assets"),
      'common': path.resolve(process.cwd(), "./src/common"),
      'base': path.resolve(process.cwd(), "./src/base"),
      ...alias
    }
  },
  devServer: {
    contentBase: './build',
    host: "127.0.0.1",
    inline: true,
    compress: true,
    hot: true,
    open: true,
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
      Component: ['react', 'Component'],
      Classnames: ['classnames'],
      ...providePlugin
    }),
    new MiniCssExtractPlugin({
      filename: '[hash:8].css',
      chunkFilename: '[id].css'
    }),
    new webpack.HotModuleReplacementPlugin(),
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
