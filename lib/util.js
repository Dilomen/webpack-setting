const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const os = require('os')

const cssModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[local]_[hash:5]'
    }
  }
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    config: {
      path: path.resolve(__dirname, './postcss.config.js')
    }
  }
}

// 获取绝对位置
const getAbsPath = (relFilePath = '') =>
  path.resolve(process.cwd(), relFilePath)

// 如果项目最外层没有index.html，生成一个html文件
function createTemplete (sereinConfig = {}) {
  const { CDN_CSS = [], CDN_JS = [] } = sereinConfig || {}
  const tempExist = fs.existsSync(path.resolve(process.cwd(), './index.html'))
  if (!tempExist) {
    try {
      const template = fs.readFileSync(path.resolve(__dirname, './template'), {
        encoding: 'utf-8'
      })
      fs.writeFileSync(
        path.resolve(__dirname, './index.html'),
        ejs.render(template, { CDN_CSS, CDN_JS })
      )
    } catch (err) {
      throw new Error('未能生成默认模板文件')
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

module.exports = {
  cssModuleLoader,
  postcssLoader,
  createTemplete,
  getAbsPath,
  getIPAdress
}
