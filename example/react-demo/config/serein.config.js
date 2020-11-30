module.exports = {
  CDNJS: [
    "https://cdn.bootcdn.net/ajax/libs/react/17.0.1/umd/react.production.min.js",
    "https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.1/umd/react-dom.production.min.js"
  ],
  CDNCSS: [],
  config: {
    framework: 'react', // default: react 暂只支持 react | vue
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
