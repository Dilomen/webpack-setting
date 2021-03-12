const { getLibAbsPath } = require('../util')
module.exports = {
  loader: getLibAbsPath(__dirname, '../../node_modules/postcss-loader'),
  // parser: 'postcss-strip-inline-comments',
  plugins: {
    [getLibAbsPath(__dirname, '../../node_modules/postcss-preset-env')]: {}
  }
}
