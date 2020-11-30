module.exports = {
  CDNJS: [],
  CDNCSS: [],
  config: {
    framework: 'vue', // default: react 暂只支持 react | vue
    ts: false, // default: false
    css: ['less', 'scss'] // default: [] 暂只支持 less | scss
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      return {}
    } else {
      return {}
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('src', 'aaaaa')
  }
}
