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

### 设置 package.json 中的 config

如果 webpack 中 entry 导入的文件不是你的文件，可以通过设置你想导入文件的路径  
如:

```js
"config": {
    "entry": "./src/index.jsx" // webapck输入配置
}
```

也可以自定义设置 config 的以下属性来对 webpack 进行配置

```js
"config": {
    "devServer": {}, // webpack-dev-server配置
    "output": {}, // webpack输出配置
    "plugins": [], // 插件
    "providePlugin": {}, // 自动引入
    "rules": [], // 模块
    "alias": {}, // 别名
    "CDN_CSS": [], // 导入css的CDN路径，在最外层没有index.html的情况下有效
    "CDN_JS": [] // 导入js的CDN路径，在最外层没有index.html的情况下有效
}
```

已经配置的别名和自动导入,可通过 config 中的 providePlugin 和 alias 进行修改和添加：

```js
new webpack.ProvidePlugin({
  React: 'react',
  ReactDOM: 'react-dom',
  Fragment: ['react', 'Fragment'],
  PureComponent: ['react', 'PureComponent'],
  Component: ['react', 'Component'],
  Classnames: ['classnames/bind']
  ...providePlugin
});
```

```js
alias: {
  'src': path.resolve(process.cwd(), "./src"),
  'components': path.resolve(process.cwd(), "./src/components"),
  'utils': path.resolve(process.cwd(), "./src/utils"),
  'assets': path.resolve(process.cwd(), "./src/assets"),
  'common': path.resolve(process.cwd(), "./src/common"),
  'base': path.resolve(process.cwd(), "./src/base"),
  ...alias
}
```

对于svg文件的处理说明：
引入的svg图片都会经url-loader处理
由于有些插件引入需要将svg文件配置为raw-loader处理，可采取以下方式引入(加?inline)，这样就会让引入的svg文件走raw-loader的处理
```js
import ICON from 'icon.svg?inline'
```