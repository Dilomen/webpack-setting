const execute = require('./execute');
const chooseDefaultEntryFile = require('./chooseDefaultEntryFile');
const transferArgs = require('./transferArgs');
const createTemplate = require('./createTemplate');
const getIPAdress = require('./getIPAdress');
const { getAbsPath, getLibAbsPath } = require('./getPath')

module.exports = {
  execute,
  transferArgs,
  createTemplate,
  getIPAdress,
  chooseDefaultEntryFile,
  getAbsPath,
  getLibAbsPath
}