const fs = require('fs')
// const path = require('path')
const webpack = require('webpack')
const { merge: webpackMerge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonOption = require('./webpack.common')
const { getLibAbsPath, getAbsPath } = require('./utils')
const { postcssLoader, cssModuleLoader } = require('./commonLoader')

const tempExist = fs.existsSync(getAbsPath('./index.html'))
// 可以在ts文件中使用css-module的方式import引入css,放到css-loader前端
// use: ['style-loader', typingForCSSModuleLoader, cssModuleLoader, postcssLoader, 'sass-loader'],
// 原理是生成一个css对应的d.ts的声明文件，由于在JS中也会生成对应的d.ts文件，所以，该loader适合纯ts项目，不建议在含有js的项目中使用，所以暂时注释
// ts中可import './*.css'或const css = require('./*.css')
// eslint-disable-next-line no-unused-vars
const typingForCSSModuleLoader = {
  loader: '@teamsupercell/typings-for-css-modules-loader',
  options: {
    formatter: 'prettier'
  }
}

const devDefaultOption = {
  devtool: 'eval-cheap-module-source-map',
  plugin: {
    HtmlWebpackPlugin: {
      plugin: HtmlWebpackPlugin,
      args: [
        {
          filename: 'index.html',
          template: tempExist
            ? getAbsPath('./index.html')
            : getLibAbsPath(__dirname, './public/index.html')
        }
      ]
    },
    HotModuleReplacementPlugin: {
      plugin: webpack.HotModuleReplacementPlugin
    }
  },
  module: {
    rule: [
      {
        test: /\.css$/,
        use: [{ loader: getLibAbsPath(__dirname, '../node_modules/style-loader') }, cssModuleLoader, postcssLoader],
      }
    ]
  },
  mode: 'development',
  stats: "errors-only"
}
const uniteOptions = webpackMerge(devDefaultOption, commonOption)
module.exports = (commandConfig) =>
  require('./mergeOptions')(uniteOptions, commandConfig)
