const path = require('path')
const babelOption = require('./public/babel.config')
const webpack = require('webpack')
const threadLoader = require('thread-loader')
const { getLibAbsPath } = require('./util')
const jsWorkerPool = {
  workers: 2,
  poolTimeout: 2000
}
threadLoader.warmup(jsWorkerPool, ['babel-loader'])

const jsxRulesOption = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: getLibAbsPath(__dirname, '../node_modules/thread-loader'),
      options: jsWorkerPool
    },
    {
      loader: getLibAbsPath(__dirname, '../node_modules/babel-loader'),
      options: {
        ...babelOption()
      }
    }
  ]
}

const assetsRulesOption = {
  test: /\.(jpe?g|png|woff|woff2|ttf|eot|gif)$/,
  use: [
    {
      loader: getLibAbsPath(__dirname, '../node_modules/cache-loader')
    },
    {
      loader: getLibAbsPath(__dirname, '../node_modules/url-loader'),
      options: {
        limit: 10000
      }
    }
  ]
}

const svgRulesOption = {
  test: /.svg$/,
  oneOf: [
    {
      resourceQuery: /inline/, // 可在svg文件后加?inline， import SVG from icon.svg?inline
      loader: getLibAbsPath(__dirname, '../node_modules/url-loader')
    },
    {
      loader: getLibAbsPath(__dirname, '../node_modules/raw-loader')
    }
  ]
}

const commonOption = {
  entry: [path.resolve(process.cwd(), './src/')],
  output: {
    path: path.resolve(process.cwd(), './build'),
    filename: '[hash:8].js'
  },
  // 方便调试
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      src: path.resolve(process.cwd(), './src'),
      components: path.resolve(process.cwd(), './src/components'),
      utils: path.resolve(process.cwd(), './src/utils'),
      assets: path.resolve(process.cwd(), './src/assets'),
      common: path.resolve(process.cwd(), './src/common'),
      base: path.resolve(process.cwd(), './src/base')
    }
  },
  plugin: {
    // 自动加载模块，而不必到处 import 或 require
    ProvidePlugin: {
      plugin: webpack.ProvidePlugin,
      args: []
    },
    DefinePlugin: {
      plugin: webpack.DefinePlugin,
      args: [{
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }]
    }
  },
  module: {
    rule: [jsxRulesOption, assetsRulesOption, svgRulesOption]
  }
}

module.exports = commonOption
