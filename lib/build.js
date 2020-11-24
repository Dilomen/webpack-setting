const webpack = require("webpack")
const option = require('./webpack.prod')
const chalk = require('chalk')
const ora = require("ora");
let spinner = ora("Serein Packing...");
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();
module.exports = () => {
    // let compiler = webpack(smp.wrap(option))
    let compiler = webpack(option)
    compiler.hooks.compile.tap('beforeRun', () => {
        console.log(chalk.blue("打包开始 ================> "))
        console.log(chalk.blue(`

        ######  ######## ########  ######## #### ##    ## 
        ##    ## ##       ##     ## ##        ##  ###   ## 
        ##       ##       ##     ## ##        ##  ####  ## 
         ######  ######   ########  ######    ##  ## ## ## 
              ## ##       ##   ##   ##        ##  ##  #### 
        ##    ## ##       ##    ##  ##        ##  ##   ### 
         ######  ######## ##     ## ######## #### ##    ##
        
         `))
         spinner.start();
    })
    compiler.run((err, stats) => {
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: true,
            chunks: false,
            chunkModules: false
        }))
        if (err && stats.hasErrors()) {
            spinner.fail('webpack打包失败')
            return
        }
        spinner.succeed('打包操作完成！')
    })
    compiler.hooks.afterEmit.tapAsync('buildAfter', (compilation, callback) => {
        console.log(chalk.blue("\n生成目录"))
        callback()
    })
}
