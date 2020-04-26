const webpack = require("webpack")
const option = require('./webpack.prod')
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();
module.exports = () => {
    // let compiler = webpack(smp.wrap(option))
    let compiler = webpack(option)
    compiler.hooks.compile.tap('beforeRun', () => {
        console.log("————————————打包开始————————————")
    })
    compiler.run((err, stats) => {
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }))
        if (err && stats.hasErrors()) {
            console.log('————————————webpack打包失败————————————');
            return
        }
        console.log('————————————webpack打包操作完成！————————————');
    })
}
