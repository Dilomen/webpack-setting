const path = require('path')
const babelOption = require('./public/babel.config')
const webpack = require('webpack')
const threadLoader = require('thread-loader')
const { getLibAbsPath } = require('./utils')
const svgToMiniDataURI = require('mini-svg-data-uri');
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
  // asset/source 相当于 raw-loader
  // asset/inline 相当于 url-loader
  // asset/resource 相当于 file-loader
  // asset: 当文件小于 8 KB 的时候会使用 asset/inline，否则会使用 asset/resource
  type: 'asset',
  generator: {
    dataUrl: content => {
      content = content.toString();
      return svgToMiniDataURI(content);
    }
  }
}

const commonOption = {
  entry: [path.resolve(process.cwd(), './src/')],
  output: {
    path: path.resolve(process.cwd(), './build'),
    filename: '[name].[contenthash].js',
  },
  cache: {
    // 将缓存类型设置为文件系统
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
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
    rule: [
      jsxRulesOption,
      assetsRulesOption,
      {
        test: /\.wasm$/,
        type: 'webassembly/experimental',
      },
      {
        test: /\.worker\.js$/,
        use: [{ loader: getLibAbsPath(__dirname, '../node_modules/worker-loader') }],
        type: 'javascript/dynamic'
      }
    ]
  }
}

module.exports = commonOption
