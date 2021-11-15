const { getLibAbsPath } = require('../utils')
function getPlugins (name) {
  return getLibAbsPath(__dirname, `../../node_modules/${name}`)
}
module.exports = () => {
  const presets = [[getPlugins('@babel/preset-env')], [getPlugins('@babel/preset-react')], [getPlugins('@babel/preset-typescript')]]
  const plugins = [
    [
      getLibAbsPath(__dirname, './serein-import'),
      { libraryGroup: ['react', 'react-dom'] }
    ],
  ]
  return {
    presets,
    plugins
  }
}
