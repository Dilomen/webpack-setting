const path = require('path')
const babelOption = require('./babel.config')
const webpack = require('webpack')
const threadLoader = require('thread-loader')
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
      loader: 'thread-loader',
      options: jsWorkerPool
    },
    {
      loader: 'babel-loader',
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
      loader: 'cache-loader'
    },
    {
      loader: 'url-loader',
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
      loader: 'url-loader'
    },
    {
      loader: 'raw-loader'
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
      args: [
        {
          // React: 'react',
          // ReactDOM: 'react-dom',
          // Fragment: ['react', 'Fragment'],
          // PureComponent: ['react', 'PureComponent'],
          // Component: ['react', 'Component'],
          // Classnames: ['classnames/bind']
        }
      ]
    }
  },
  module: {
    rule: [jsxRulesOption, assetsRulesOption, svgRulesOption]
  }
}

module.exports = commonOption
