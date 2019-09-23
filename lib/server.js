const webpack = require("webpack")
const option = require('./webpack.config')
const webpackDevServer = require('webpack-dev-server');
module.exports = () => {
    let compiler = webpack(option)
    compiler.hooks.compile.tap('done', stats => {
        console.log("编译成功！");
    })
    compiler.hooks.compile.tap('failed', err => {
        if (!err) {
            console.error("编译失败Error :"+err)
        }
    })
    const devServer = new webpackDevServer(compiler, {});
    devServer.listen("8029", "127.0.0.1", (err) => {
        if (!err) {
            console.log("127.0.0.1:8029启动了")
        }
    })
}