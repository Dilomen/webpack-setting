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

### 可在更目录下配置自定义的 webpack 配置

可以在根目录下创建以下文件（具体配置信息需要符合 webpack 规则）

- webpack.config.js 将会覆盖默认的**统一**配置
- webpack.dev.js 将会覆盖默认的**开发**配置
- webpack.prod.js 将会覆盖默认的**生产**配置

> 由于 webpack-merge 不能覆盖默认配置的 rule 和 plugins,所以抛出一个 changeDefault 方法，可以改变默认配置，将需要merge的内容放到options

```js
const changeDefault = function(options) {
  console.log("options", options);
  return { ...options };
};

module.exports = {
  options: {},
  changeDefault,
};
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

对于 svg 文件的处理说明：
引入的 svg 图片都会经 url-loader 处理
由于有些插件引入需要将 svg 文件配置为 raw-loader 处理，可采取以下方式引入(加?inline)，这样就会让引入的 svg 文件走 raw-loader 的处理

```js
import ICON from "icon.svg?inline";
```
