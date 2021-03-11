const { getLibAbsPath } = require('../util')
function getPlugins (name) {
  return getLibAbsPath(__dirname, `../../node_modules/${name}`)
}
module.exports = () => {
  const presets = [[getPlugins('@babel/preset-env')], [getPlugins('@babel/preset-react')]]
  const plugins = [
    // Stage 0
    getPlugins('@babel/plugin-proposal-function-bind'),
    // Stage 1
    getPlugins('@babel/plugin-proposal-export-default-from'),
    getPlugins('@babel/plugin-proposal-logical-assignment-operators'),
    [getPlugins('@babel/plugin-proposal-optional-chaining'), { loose: false }],
    [getPlugins('@babel/plugin-proposal-pipeline-operator'), { proposal: 'minimal' }],
    [getPlugins('@babel/plugin-proposal-nullish-coalescing-operator'), { loose: false }],
    getPlugins('@babel/plugin-proposal-do-expressions'),
    // Stage 2
    [getPlugins('@babel/plugin-proposal-decorators'), { legacy: true }],
    getPlugins('@babel/plugin-proposal-function-sent'),
    getPlugins('@babel/plugin-proposal-export-namespace-from'),
    getPlugins('@babel/plugin-proposal-numeric-separator'),
    getPlugins('@babel/plugin-proposal-throw-expressions'),
    // Stage 3
    getPlugins('@babel/plugin-syntax-dynamic-import'),
    getPlugins('@babel/plugin-syntax-import-meta'),
    [getPlugins('@babel/plugin-proposal-class-properties'), { loose: false }],
    getPlugins('@babel/plugin-proposal-json-strings'),
    getPlugins('@babel/plugin-transform-runtime')
  ]
  return {
    presets,
    plugins
  }
}
