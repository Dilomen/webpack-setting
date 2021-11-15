const webpack = require('webpack')
const setOption = require('./webpack.dev')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const { getIPAdress } = require('./util')
const path = require('path')
const chalk = require('chalk')
const port = 3000
const host = getIPAdress() || '127.0.0.1'
module.exports = async (commandConfig) => {
  // 检查端口是否被占用
  const newPort = await choosePort(host, port).catch((err) => {
    console.log(err)
    return null
  })
  const compiler = webpack(setOption(commandConfig))
  compiler.hooks.compile.tap('done', (stats) => {
    clearConsole()
    console.log(chalk.blue(`编译成功:http://${host}:${newPort}`))
  })
  compiler.hooks.compile.tap('failed', (err) => {
    if (!err) {
      clearConsole()
      console.error(chalk.red('编译失败Error :') + err)
      return
    }
    console.log(chalk.blue(`编译成功:http://${host}:${newPort}`))
  })
  
  const devServer = new WebpackDevServer({
    port: newPort,
    open: true,
    host,
    compress: true,
    hot: true,
    static: {
      publicPath: path.resolve(process.cwd(), './build'),
    }
  }, compiler)
  devServer.start(newPort).catch(err => reject(err))
}
