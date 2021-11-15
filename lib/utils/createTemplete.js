const fs = require('fs')
const ejs = require('ejs')
const { getLibAbsPath, getAbsPath } = require('./getPath')

// 如果项目最外层没有index.html，生成一个html文件
function createTemplete (sereinConfig = {}) {
  const { CDNCSS = [], CDNJS = [] } = sereinConfig || {}
  const tempExist = fs.existsSync(getAbsPath('./index.html'))
  if (!tempExist) {
    try {
      const template = fs.readFileSync(getLibAbsPath(__dirname, '../public/template'), {
        encoding: 'utf-8'
      })
      fs.writeFileSync(
        getLibAbsPath(__dirname, '../public/index.html'),
        ejs.render(template, { CDNCSS, CDNJS })
      )
    } catch (err) {
      throw new Error('未能生成默认模板文件', err)
    }
  }
}

module.exports = createTemplete