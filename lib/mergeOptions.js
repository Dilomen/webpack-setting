const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const WebpackChain = require('webpack-chain')
const { merge: webpackMerge } = require('webpack-merge')
const { createTemplete } = require('./util')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { cssModuleLoader, postcssLoader, getAbsPath } = require('./util')
const { getLibAbsPath } = require('./util')
const babelOption = require('./public/babel.config')
function getNodeModules (path) {
  return getLibAbsPath(__dirname, `../node_modules/${path}`)
}

module.exports = (defaultConfig, commandConfig = {}) => {
  let extraOption = {}
  const sereinConfigPath = path.resolve(
    process.cwd(),
    commandConfig.config || './serein.config.js'
  )
  let mergeConfig = {}
  const isExist = fs.existsSync(sereinConfigPath)
  const webpackChainOption = new WebpackChain()
  // 如果存在serein.config.js配置文件
  if (isExist) {
    const {
      configureWebpack = {},
      chainWebpack,
      config = {}
    } = require(sereinConfigPath)
    mergeConfig = {
      ...config,
      typescript: commandConfig.typescript || config.ts,
      framework: commandConfig.framework || config.framework
    }
    createTemplete(require(sereinConfigPath))
    // configureWebpack
    if (configureWebpack) {
      if (configureWebpack instanceof Function) {
        extraOption = require(sereinConfigPath).configureWebpack(defaultConfig)
      } else if (Object.prototype.toString.call(configureWebpack) === "[object Object]") {
        extraOption = require(sereinConfigPath).configureWebpack || {}
      } else {
        throw new Error('TypeError: configureWebpack can only be a function or an object')
      }
    }
    const uniteOptions = webpackMerge(defaultConfig, extraOption)
    // chainWebpack
    webpackChainOption.merge(uniteOptions)
    chainWebpack && chainWebpack(webpackChainOption)
  } else {
    createTemplete({})
    mergeConfig = { ...commandConfig }
    console.warn('Warning: The serein.config.js file is not found, Please confirm whether additional configuration is required')
    webpackChainOption.merge(defaultConfig)
  }
  if (mergeConfig.framework === 'vue') handleVueSetting(webpackChainOption)
  if (mergeConfig.framework === 'react') handleReactSetting(webpackChainOption)
  if (mergeConfig.typescript) handleTypeScriptsSetting(webpackChainOption)
  if (mergeConfig.css) handleCSSSetting(webpackChainOption, mergeConfig)
  const exportOptions = webpackChainOption.toConfig()
  if (commandConfig.entry) {
    exportOptions.entry = path.resolve(process.cwd(), commandConfig.entry)
  }
  return exportOptions
}

function handleVueSetting (webpackChainOption) {
  webpackChainOption.module
    .rule('vue')
    .test(/.vue$/)
    .use('vue-loader')
    .loader(getLibAbsPath(__dirname, '../node_modules/vue-loader'))
  webpackChainOption.resolve.alias.set('vue$', getLibAbsPath(__dirname, '../node_modules/vue/dist/vue.esm.js'))
  webpackChainOption.plugin('VueLoaderPlugin').use(require(getLibAbsPath(__dirname, '../node_modules/vue-loader/lib/plugin.js')))
}

function handleReactSetting (webpackChainOption) {
  webpackChainOption.plugin('ProvidePlugin').use(
    webpack.ProvidePlugin,
    [{
      React: 'react',
      ReactDOM: 'react-dom',
      Fragment: ['react', 'Fragment'],
      PureComponent: ['react', 'PureComponent'],
      Component: ['react', 'Component'],
    }]
  )
}
function handleTypeScriptsSetting (webpackChainOption) {
  webpackChainOption.module
    .rule('ts')
    .test(/\.tsx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel-loader')
    .loader(getNodeModules('babel-loader'))
    .options({
      ...babelOption()
    })
}

function handleCSSSetting (webpackChainOption, config) {
  const cssExtends = {
    less: () =>
      webpackChainOption.module
        .rule('less')
        .test(/\.less$/)
        .include.add(getAbsPath('src'))
        .end()
        .use('style-loader')
        .loader(getNodeModules('style-loader'))
        .end()
        .use('css-loader')
        .loader(cssModuleLoader)
        .end()
        .use('postcss-loader')
        .loader(postcssLoader.loader)
        .options(postcssLoader.options)
        .end()
        .use('less-loader')
        .loader(getNodeModules('less-loader'))
        .end()
        .include.add(getAbsPath('node_modules'))
        .end()
        .use('style-loader')
        .loader(getNodeModules('style-loader'))
        .end()
        .use('css-loader')
        .loader(getNodeModules('css-loader'))
        .end()
        .use('postcss-loader')
        .loader(postcssLoader.loader)
        .options(postcssLoader.options)
        .end()
        .use('less-loader')
        .loader(getNodeModules('less-loader'))
        .end(),
    scss: () =>
      webpackChainOption.module
        .rule('scss')
        .test(/\.scss$/)
        .include
        .add(getAbsPath('src'))
        .end()
        .use('style-loader')
        .loader(getNodeModules('style-loader'))
        .end()
        .use('css-loader')
        .loader(cssModuleLoader)
        .end()
        .use('postcss-loader')
        .loader(postcssLoader.loader)
        .options(postcssLoader.options)
        .end()
        .use('sass-loader')
        .loader(getNodeModules('sass-loader'))
        .end()
        .include.add(getAbsPath('node_modules'))
        .end()
        .use('style-loader')
        .loader(getNodeModules('style-loader'))
        .end()
        .use('css-loader')
        .loader(getNodeModules('css-loader'))
        .end()
        .use('postcss-loader')
        .loader(postcssLoader.loader)
        .options(postcssLoader.options)
        .end()
        .use('sass-loader')
        .loader(getNodeModules('sass-loader'))
        .end(),
    lessProd: () =>
      webpackChainOption.module
        .rule('less')
        .test(/\.less$/)
        .use('style-loader')
        .loader(MiniCssExtractPlugin.loader)
        .options({ publicPath: '../' })
        .end()
        .use('css-loader')
        .loader(getNodeModules('css-loader'))
        .end()
        .use('postcss-loader')
        .loader(postcssLoader.loader)
        .options(postcssLoader.options)
        .end()
        .use('less-loader')
        .loader(getNodeModules('less-loader'))
        .end(),
    scssProd: () =>
      webpackChainOption.module
        .rule('scss')
        .test(/\.scss$/)
        .use('style-loader')
        .loader(MiniCssExtractPlugin.loader)
        .options({ publicPath: '../' })
        .end()
        .use('css-loader')
        .loader(getNodeModules('css-loader'))
        .end()
        .use('postcss-loader')
        .loader(postcssLoader.loader)
        .options(postcssLoader.options)
        .end()
        .use('sass-loader')
        .loader(getNodeModules('sass-loader'))
        .end()
  }
  if (typeof config.css === 'string') {
    process.env.NODE_ENV === 'development'
      ? cssExtends[config.css]()
      : cssExtends[config.css + 'Prod']()
  } else if (Array.isArray(config.css)) {
    config.css.forEach((name) => {
      process.env.NODE_ENV === 'development'
        ? cssExtends[name]()
        : cssExtends[name + 'Prod']()
    })
  }
}
