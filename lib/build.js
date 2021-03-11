const webpack = require('webpack')
const setOption = require('./webpack.prod')
const chalk = require('chalk')
const ora = require('ora')
const spinner = ora('Serein Packing...')
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const smp = new SpeedMeasurePlugin();
module.exports = async (commandConfig) => {
  // let compiler = webpack(smp.wrap(option))
  const compiler = webpack(await setOption(commandConfig))
  compiler.hooks.compile.tap('beforeRun', () => {
    console.log(
      chalk.blue(`
 ######  ######## ########  ######## #### ##    ## 
##    ## ##       ##     ## ##        ##  ###   ## 
##       ##       ##     ## ##        ##  ####  ## 
 ######  ######   ########  ######    ##  ## ## ## 
      ## ##       ##   ##   ##        ##  ##  #### 
##    ## ##       ##    ##  ##        ##  ##   ### 
 ######  ######## ##     ## ######## #### ##    ##
         `)
    )
    spinner.start()
  })
  compiler.run((err, stats) => {
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      })
    )
    if (err && stats.hasErrors()) {
      spinner.fail('webpack打包失败')
      return
    }
    spinner.succeed('打包操作完成！')
  })
  compiler.hooks.afterEmit.tapAsync('buildAfter', (compilation, callback) => {
    console.log(chalk.blue('\n生成目录'))
    callback()
  })
}
