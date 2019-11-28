const webpack = require("webpack")
const option = require('./webpack.config')
const webpackDevServer = require('webpack-dev-server');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('react-dev-utils/clearConsole');
const {port = 3000, host = "127.0.0.1"} = option.devServer
module.exports = () => {
    let compiler = webpack(option)
    compiler.hooks.compile.tap('done', stats => {
        console.log("编译成功！");
    })
    compiler.hooks.compile.tap('failed', err => {
        if (!err) {
            clearConsole()
            console.error("编译失败Error :" + err)
        }
    })
    const devServer = new webpackDevServer(compiler, {});
    devServer.listen(port, host, (err) => {
        if (!err) {
            console.log(`${host}:${port}启动了`)
            openBrowser(`http://${host}:${port}`)
        }
    })
}