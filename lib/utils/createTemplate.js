const fs = require('fs')
const ejs = require('ejs')
const { getLibAbsPath, getAbsPath } = require('./getPath')
const execute = require('./execute')
let htmlFilePath = '';

const createRandomStr = () =>
  Math.random()
    .toString(36)
    .slice(2);

// 如果项目最外层没有index.html，生成一个html文件
function createTemplate (sereinConfig = {}) {
  const { CDNCSS = [], CDNJS = [] } = sereinConfig || {}
  htmlFilePath = getAbsPath('./index.html')
  const tempExist = fs.existsSync(htmlFilePath)
  if (!tempExist) {
    try {
      const template = fs.readFileSync(getLibAbsPath(__dirname, '../public/template'), {
        encoding: 'utf-8'
      })
      htmlFilePath = getLibAbsPath(__dirname, `../namespace/${createRandomStr() || htmlFileName}.html`)
      createNameSpaceDir()
      fs.writeFileSync(
        htmlFilePath,
        ejs.render(template, { CDNCSS, CDNJS })
      )
    } catch (err) {
      throw new Error('未能生成默认模板文件: ' + err)
    }
  }

  process.on('exit', (code) => {
    htmlFilePath && execute(`rm -f ${htmlFilePath}`)
  });

  return htmlFilePath
}

function createNameSpaceDir() {
  const namespaceDirPath = getLibAbsPath(__dirname, '../namespace')
  if (!fs.existsSync(namespaceDirPath)) {
    fs.mkdirSync(namespaceDirPath)
  }
}

module.exports = createTemplate