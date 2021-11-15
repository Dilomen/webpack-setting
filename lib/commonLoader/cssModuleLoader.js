const { getLibAbsPath } = require('../utils')

const cssModuleLoader = {
  loader: getLibAbsPath(__dirname, '../../node_modules/css-loader'),
  options: {
    modules: {
      localIdentName: '[local]_[contenthash:5]'
    }
  }
}


module.exports = cssModuleLoader
