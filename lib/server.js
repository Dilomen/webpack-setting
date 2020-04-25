const path = require('path')
const webpack = require("webpack")
const option = require('./webpack.dev')
const webpackDevServer = require('webpack-dev-server');
const openBrowser = require('react-dev-utils/openBrowser');
const clearConsole = require('react-dev-utils/clearConsole');
const { config = {} } = require(path.resolve(process.cwd(), './package.json'))
const { devServer: devServerConfig = {} } = config
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const port = 3000
const host = "127.0.0.1"
module.exports = async () => {
    // 检查端口是否被占用
    const newPort = await choosePort(host, port).catch(err => {
        console.log(err);
        return null;
    });
    let compiler = webpack(option)
    compiler.hooks.compile.tap('done', stats => {
        clearConsole();
        console.log(`编译成功:http://${host}:${newPort}`);
    })
    compiler.hooks.compile.tap('failed', err => {
        if (!err) {
            clearConsole()
            console.error("——————————编译失败Error :" + err)
        }
    })
    const devServer = new webpackDevServer(compiler, {
        port: newPort,
        open: true,
        contentBase: './build',
        host: '127.0.0.1',
        inline: true,
        compress: true,
        hot: true,
        stats: 'errors-only',
        historyApiFallback: true, // 开发模式下，当单页面应用使用BrowerHistroy路由时，可以追寻到根路径，不会出现404的问题
        ...devServerConfig
    });
    devServer.listen(newPort)
}