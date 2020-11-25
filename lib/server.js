const path = require("path");
const webpack = require("webpack");
const setOption = require("./webpack.dev");
const webpackDevServer = require("webpack-dev-server");
const clearConsole = require("react-dev-utils/clearConsole");
const { config = {} } = require(path.resolve(process.cwd(), "./package.json"));
const { devServer: devServerConfig = {} } = config;
const { choosePort } = require("react-dev-utils/WebpackDevServerUtils");
const { getIPAdress } = require("./util");
const chalk = require('chalk')
const port = 3000;
const host = getIPAdress() || "127.0.0.1";
module.exports = async (configRelativePath) => {
  // 检查端口是否被占用
  const newPort = await choosePort(host, port).catch((err) => {
    console.log(err);
    return null;
  });
  let compiler = webpack(setOption(configRelativePath));
  compiler.hooks.compile.tap("done", (stats) => {
    clearConsole();
    console.log(chalk.blue(`编译成功:http://${host}:${newPort}`));
  });
  compiler.hooks.compile.tap("failed", (err) => {
    if (!err) {
      clearConsole();
      console.error(chalk.red("编译失败Error :") + err);
    }
  });
  const devServer = new webpackDevServer(compiler, {
    port: newPort,
    open: true,
    contentBase: "./build",
    host,
    inline: true,
    compress: true,
    hot: true,
    stats: "errors-only",
    historyApiFallback: true, // 开发模式下，当单页面应用使用BrowerHistroy路由时，可以追寻到根路径，不会出现404的问题
    ...devServerConfig,
  });
  devServer.listen(newPort);
};
