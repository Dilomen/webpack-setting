const execute = require('./execute');
const chooseDefaultEntryFile = require('./chooseDefaultEntryFile');
const transferArgs = require('./transferArgs');
const createTemplete = require('./createTemplete');
const getIPAdress = require('./getIPAdress');
const { getAbsPath, getLibAbsPath } = require('./getPath')

module.exports = {
  execute,
  transferArgs,
  createTemplete,
  getIPAdress,
  chooseDefaultEntryFile,
  getAbsPath,
  getLibAbsPath
}