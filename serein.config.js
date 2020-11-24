module.exports = {
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