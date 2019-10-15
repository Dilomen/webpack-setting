const webpack = require("webpack")
const option = require('./webpack.config')
module.exports = () => {
    let compiler = webpack(option)
    compiler.run((err, stats) => {
        console.log(stats)
        if (err && stats.hasErrors()) {
            console.log('webpack打包失败');
            return
        }
        console.log('webpack打包操作完成！');
    })
}