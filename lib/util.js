const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const os = require('os')
const exec = require('child_process').exec

// 获取绝对位置
const getAbsPath = (relFilePath = '') =>
  path.resolve(process.cwd(), relFilePath)

// 获取该依赖包下的绝对地址
const getLibAbsPath = (dirname, relFilePath = '') =>
  path.resolve(dirname, relFilePath)

const cssModuleLoader = {
  loader: getLibAbsPath(__dirname, '../node_modules/css-loader'),
  options: {
    modules: {
      localIdentName: '[local]_[hash:5]'
    }
  }
}

const postcssLoader = {
  loader: getLibAbsPath(__dirname, '../node_modules/postcss-loader'),
  options: {
    config: {
      path: getLibAbsPath(__dirname, './public/postcss.config.js')
    }
  }
}

// 如果项目最外层没有index.html，生成一个html文件
function createTemplete (sereinConfig = {}) {
  const { CDNCSS = [], CDNJS = [] } = sereinConfig || {}
  const tempExist = fs.existsSync(getAbsPath('./index.html'))
  if (!tempExist) {
    try {
      const template = fs.readFileSync(getLibAbsPath(__dirname, './public/template'), {
        encoding: 'utf-8'
      })
      fs.writeFileSync(
        getLibAbsPath(__dirname, './public/index.html'),
        ejs.render(template, { CDNCSS, CDNJS })
      )
    } catch (err) {
      throw new Error('未能生成默认模板文件', err)
    }
  }
}

// 获取本地ip地址
function getIPAdress () {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

function transferArgs (args) {
  const Len = args.length
  const argsObj = {}
  for (let i = 0; i < Len; i++) {
    if (/^-\S/.test(args[i])) {
      argsObj[args[i]] = args[i + 1] || ''
      ++i
    }
  }
  return argsObj
}

function execute (cmd, options, cb, stdListener) {
  return new Promise((resolve, reject) => {
    try {
      const child = exec(cmd, options, cb)
      child.on('error', (err) => {
        reject(err)
      })
      child.stderr.on('data', (msg) => {
        stdListener && stdListener(msg)
      })
      child.stdout.on('data', (msg) => {
        stdListener && stdListener(msg)
      })
      child.on('close', (code) => {
        resolve(code)
      })
    } catch (err) {
      console.error('Error: ' + err)
      reject(err)
    }
  })
}

module.exports = {
  cssModuleLoader,
  postcssLoader,
  createTemplete,
  getAbsPath,
  getLibAbsPath,
  getIPAdress,
  transferArgs,
  execute
}
