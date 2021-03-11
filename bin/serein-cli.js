#!/usr/bin/env node
const { Command } = require('commander')
const program = new Command()
const configPkg = require('../package.json')
const inquirer = require('inquirer')

program
  .version(configPkg.version || '1.0.0')
  .arguments('<command> [options]')
  .usage('<command> [options]')
  .description('A webpack configuration tool to help you develop quickly', {
    command: 'run or build',
    options: 'Command configuration'
  })
  .option('-p, --port <port>', 'Set service port')
  .option('-f, --framework <framework>', 'Please choose framework: vue or react')
  .option('-e, --entry <file>', 'Set the entry file path, The default is index.js in the root directory')
  .option('-c, --config <path>', 'Set the config file path')
  .option('-ts, --typescript', 'Does it support TypeScript')
  .addHelpText('after', `
Examples:
  serein run
  serein run -e ./src/index.js
  serein build
  serein build -f vue`
  )

program
  .command('run [options]')
  .description('Run a project')
  .action((options) => {
    process.env.NODE_ENV = 'development'
    const params = program.opts()
    chooseFramework(params, () => {
      require('../lib/server')(params)
    })
  })

program
  .command('build [options]')
  .description('Package a project')
  .action(async (options) => {
    process.env.NODE_ENV = 'production'
    const params = program.opts()
    chooseFramework(params, () => {
      require('../lib/build')(params)
    })
  })
program.parse(process.argv)

function chooseFramework (options, fn) {
  if (!options.framework) {
    inquirer.prompt([{
      type: 'list',
      name: 'framework',
      message: 'Please choose framework',
      choices: [
        { name: 'Vue', value: 'vue' },
        { name: 'React', value: 'react' }
      ]
    }]).then(({ framework }) => {
      options.framework = framework
      fn()
    }).catch(error => {
      console.log(error)
    })
  } else {
    fn()
  }
}
