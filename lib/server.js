const webpack = require("webpack")
const option = require('./webpack.config')
const webpackDevServer = require('webpack-dev-server');
const { host, port } = option.devServer
module.exports = () => {
    let compiler = webpack(option)
    compiler.hooks.compile.tap('done', stats => {
        console.log("编译成功！");
    })
    compiler.hooks.compile.tap('failed', err => {
        if (!err) {
            console.error("编译失败Error :" + err)
        }
    })
    const devServer = new webpackDevServer(compiler, {});
    devServer.listen(port, host, (err) => {
        if (!err) {
            console.log(`${host}启动了`)
        }
    })
}