const path = require('path')

// 获取绝对位置
const getAbsPath = (relFilePath = '') =>
  path.resolve(process.cwd(), relFilePath)

// 获取该依赖包下的绝对地址
const getLibAbsPath = (dirname, relFilePath = '') =>
  path.resolve(dirname, relFilePath)

module.exports = {
  getAbsPath,
  getLibAbsPath
}