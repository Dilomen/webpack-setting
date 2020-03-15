const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonOption = require('./webpack.common')
const { createTemplete, getAbsPath } = require('./util')
createTemplete()

const cssModuleLoader = {
  loader: "css-loader",
  options: {
    modules: {
      localIdentName: "[local]_[hash:5]"
    }
  }
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    config: {
      path: path.resolve(__dirname, './postcss.config.js')
    }
  }
}

// 可以在ts文件中使用css-module的方式import引入css,放到css-loader前端
// loaders: ['style-loader', typingForCSSModuleLoader, cssModuleLoader, postcssLoader, 'sass-loader'],
// 原理是生成一个css对应的d.ts的声明文件，由于在JS中也会生成对应的d.ts文件，所以，该loader适合纯ts项目，不建议在含有js的项目中使用，所以暂时注释
// ts中可import './*.css'或const css = require('./*.css')
const typingForCSSModuleLoader = {
  loader: '@teamsupercell/typings-for-css-modules-loader',
  options: {
      formatter: "prettier"
  }
}

let option = merge({
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    // new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.scss$/,
      loaders: ['style-loader', cssModuleLoader, postcssLoader, 'sass-loader'],
      include: [getAbsPath('src')]
    }, {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', postcssLoader, 'sass-loader'],
      include: [getAbsPath('node_modules')]
    }, {
      test: /\.css$/,
      use: ['style-loader',  cssModuleLoader, postcssLoader],
      include: [getAbsPath('src')]
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', postcssLoader],
      include: [getAbsPath('node_modules')]
    }]
  },
  mode: 'development'
}, commonOption)

module.exports = option