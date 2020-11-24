const fs = require('fs')
const path = require("path");
const WebpackChain = require("webpack-chain");
const webpackMerge = require("webpack-merge")
module.exports = (defaultConfig) => {
  // configureWebpack
  let extraOption = {}
  const sereinConfigPath = path.resolve(process.cwd(), './serein.config.js')
  if (fs.existsSync(sereinConfigPath)) {
    const { configureWebpack } = require(sereinConfigPath)
    if (configureWebpack && (configureWebpack instanceof Function)) {
      extraOption = require(sereinConfigPath).configureWebpack(defaultConfig)
    } else {
      extraOption = require(sereinConfigPath).configureWebpack
    }
  }

  const uniteOptions = webpackMerge(defaultConfig, extraOption)
  // chainWebpack
  const webpackChainOption = new WebpackChain()
  webpackChainOption.merge(uniteOptions)
  if (fs.existsSync(sereinConfigPath)) {
    const { chainWebpack } = require(sereinConfigPath)
    chainWebpack(webpackChainOption)
  }
  return webpackChainOption.toConfig();
}
