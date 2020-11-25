## 介绍

将 webpack 上传到 npm，使用依赖来统一配置

### 安装命令

```js
yarn add webpack-setting
```

### 设置 package.json 中的命令，就可以执行命令，进行开发和打包

```js
"scripts": {
    "start": "npm run dev",
    "dev": "NODE_ENV=development mywebpack",
    "build": "NODE_ENV=production mywebpack"
}
```

#### 支持对配置文件的路径进行自定义

```js
"dev": "NODE_ENV=development mywebpack ./config/serein.config.js",
"build": "NODE_ENV=production mywebpack ./config/serein.config.js"
```

### 可在根目录下配置自定义的 webpack 配置

为了降低学习成本，及更改配置项的灵活性，将采用webpack-chain插件，可以以以下两种方式进行webpack配置的修改

- 直接对象merge覆盖
- 使用webpack-chain的方式  
<https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans?spm=a2c6h.14275010.0.0.3d7b22efZu5PJT>

需要在根目录下建一个serein.config.js的文件

chainWebpack > configureWebpack，即chainWebpack在configureWebpack之后执行

```js
module.exports = {
  // 直接返回一个webpack配置对象，该对象会和已有的对象进行合并
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      return {}
    } else {
      return {}
    }
  },
  // 对已有配置通过webpack-chain的规则进行修改
  chainWebpack: (config) => {
    config.resolve.alias.set('src', './src/')
  }
}
```

#### 对于 svg 文件的处理说明

引入的 svg 图片都会经 url-loader 处理
由于有些插件引入需要将 svg 文件配置为 raw-loader 处理，可采取以下方式引入(加?inline)，这样就会让引入的 svg 文件走 raw-loader 的处理

```js
import ICON from "icon.svg?inline";
```
