const fs = require('fs')
const path = require('path')

function chooseDefaultEntryFile (entry) {
  if (entry) return path.resolve(process.cwd(), entry);
  const defaultIndexFile = path.resolve(process.cwd(), './')
  const isDefaultIndexFileExist = fs.existsSync(defaultIndexFile)

  if (isDefaultIndexFileExist) return defaultIndexFile

  const defaultSrcIndexFile = path.resolve(process.cwd(), './src')
  const isDefaultSrcIndexFileExist = fs.existsSync(defaultSrcIndexFile)
  return isDefaultSrcIndexFileExist ? defaultSrcIndexFile : defaultIndexFile
}

module.exports = chooseDefaultEntryFile