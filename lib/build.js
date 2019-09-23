const webpack = require("webpack")
const option = require('./webpack.config')
module.exports = () => {
    let compiler = webpack(option)
    compiler.run((err, status) => {
        if (!err) {
            console.log('webpack打包操作完成！');
        }
    })
}