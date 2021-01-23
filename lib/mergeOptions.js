const fs = require('fs')
const path = require('path')
const WebpackChain = require('webpack-chain')
const webpackMerge = require('webpack-merge')
const { createTemplete } = require('./util')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { cssModuleLoader, postcssLoader, getAbsPath } = require('./util')
module.exports = (defaultConfig, configRelactivePath = '') => {
  let extraOption = {}
  const sereinConfigPath = path.resolve(
    process.cwd(),
    configRelactivePath || './serein.config.js'
  )
  const isExist = fs.existsSync(sereinConfigPath)
  const webpackChainOption = new WebpackChain()
  if (!isExist) {
    createTemplete({})
    console.warn('serein.config.js 不存在！')
    webpackChainOption.merge(defaultConfig)
    return webpackChainOption.toConfig()
  }
  const {
    configureWebpack,
    chainWebpack,
    config = {}
  } = require(sereinConfigPath)
  createTemplete(require(sereinConfigPath))
  if (config.ts) {
    webpackChainOption.module
      .rule('ts')
      .test(/\.tsx?$/)
      .exclude.add(/node_modules/)
      .end()
      .use('cache-loader')
      .loader('cache-loader')
      .end()
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        configFile: path.resolve(__dirname, './tsconfig.json')
      })
  }

  if (config.framework === 'vue') {
    let VueLoaderPlugin = null
    const { stdout } = require('child_process').execSync('npm install --save-dev vue-loader')
    console.log(stdout)
    VueLoaderPlugin = require(path.resolve(process.cwd(), './node_modules/vue-loader/lib/plugin.js'))
    webpackChainOption.module
      .rule('vue')
      .test(/.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
    webpackChainOption.resolve.alias.set('vue$', 'vue/dist/vue.esm.js')
    webpackChainOption.plugin('VueLoaderPlugin').use(VueLoaderPlugin)
  }

  if (config.css) {
    const cssExtends = {
      less: () =>
        webpackChainOption.module
          .rule('less')
          .test(/\.less$/)
          .include.add(getAbsPath('src'))
          .end()
          .use('style-loader')
          .loader('style-loader')
          .end()
          .use('css-loader')
          .loader(cssModuleLoader)
          .end()
          .use('postcss-loader')
          .loader(postcssLoader.loader)
          .options(postcssLoader.options)
          .end()
          .use('less-loader')
          .loader('less-loader')
          .end()
          .include.add(getAbsPath('node_modules'))
          .end()
          .use('style-loader')
          .loader('style-loader')
          .end()
          .use('css-loader')
          .loader('css-loader')
          .end()
          .use('postcss-loader')
          .loader(postcssLoader.loader)
          .options(postcssLoader.options)
          .end()
          .use('less-loader')
          .loader('less-loader')
          .end(),
      scss: () =>
        webpackChainOption.module
          .rule('scss')
          .test(/\.scss$/)
          .include
          .add(getAbsPath('src'))
          .end()
          .use('style-loader')
          .loader('style-loader')
          .end()
          .use('css-loader')
          .loader(cssModuleLoader)
          .end()
          .use('postcss-loader')
          .loader(postcssLoader.loader)
          .options(postcssLoader.options)
          .end()
          .use('sass-loader')
          .loader('sass-loader')
          .end()
          .include.add(getAbsPath('node_modules'))
          .end()
          .use('style-loader')
          .loader('style-loader')
          .end()
          .use('css-loader')
          .loader('css-loader')
          .end()
          .use('postcss-loader')
          .loader(postcssLoader.loader)
          .options(postcssLoader.options)
          .end()
          .use('sass-loader')
          .loader('sass-loader')
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
          .loader('css-loader')
          .end()
          .use('postcss-loader')
          .loader(postcssLoader.loader)
          .options(postcssLoader.options)
          .end()
          .use('less-loader')
          .loader('less-loader')
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
          .loader('css-loader')
          .end()
          .use('postcss-loader')
          .loader(postcssLoader.loader)
          .options(postcssLoader.options)
          .end()
          .use('sass-loader')
          .loader('sass-loader')
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

  // configureWebpack
  if (configureWebpack && configureWebpack instanceof Function) {
    extraOption = require(sereinConfigPath).configureWebpack(defaultConfig)
  } else {
    extraOption = require(sereinConfigPath).configureWebpack
  }
  const uniteOptions = webpackMerge(defaultConfig, extraOption)
  // chainWebpack
  webpackChainOption.merge(uniteOptions)
  chainWebpack(webpackChainOption)
  return webpackChainOption.toConfig()
}
