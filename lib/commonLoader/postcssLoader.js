const { getLibAbsPath } = require('../utils')

const postcssLoader = {
  loader: getLibAbsPath(__dirname, '../../node_modules/postcss-loader'),
  options: {
    postcssOptions: {
      plugins: [
        [getLibAbsPath(__dirname, '../../node_modules/postcss-preset-env'), {}]
      ]
    }
  }
}

module.exports = postcssLoader
