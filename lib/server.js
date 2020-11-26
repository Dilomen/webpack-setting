const webpack = require('webpack')
const setOption = require('./webpack.dev')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const { getIPAdress } = require('./util')
const chalk = require('chalk')
const port = 3000
const host = getIPAdress() || '127.0.0.1'
module.exports = async (configRelativePath) => {
  // 检查端口是否被占用
  const newPort = await choosePort(host, port).catch((err) => {
    console.log(err)
    return null
  })
  console.log('===>', setOption(configRelativePath))
  const compiler = webpack(setOption(configRelativePath))
  compiler.hooks.compile.tap('done', (stats) => {
    clearConsole()
    console.log(chalk.blue(`编译成功:http://${host}:${newPort}`))
  })
  compiler.hooks.compile.tap('failed', (err) => {
    if (!err) {
      clearConsole()
      console.error(chalk.red('编译失败Error :') + err)
    }
  })
  const devServer = new WebpackDevServer(compiler, {
    port: newPort,
    open: true,
    contentBase: './build',
    host,
    inline: true,
    compress: true,
    hot: true,
    stats: 'errors-only',
    historyApiFallback: true // 开发模式下，当单页面应用使用BrowerHistroy路由时，可以追寻到根路径，不会出现404的问题
  })
  devServer.listen(newPort)
}
