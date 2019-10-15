## 介绍：将 webpack 上传到 npm，使用依赖来统一配置

### 安装命令

```
yarn add my-webpack-test
```

### 设置 package.json 中的命令，就可以执行命令，进行开发和打包

```json
"scripts": {
    "start": "npm run dev",
    "dev": "NODE_ENV=development mywebpack",
    "build": "NODE_ENV=production mywebpack"
}
```

### 设置 package.json 中的 config（没有就新建）

如果 webpack 中 entry 导入的文件不是你的文件，可以通过设置你想导入文件的路径  
如:

```json
"config": {
    "fileEntry": "./src/index.jsx" // webapck输入配置
}
```

也可以自定义设置 config 的以下属性来对 webpack 进行配置

```json
"config": {
    "devServer": {}, // webpack-dev-server配置
    "output": {}, // webpack输出配置
    "plugins": [], // 插件
    "providePlugin": {}, // 自动引入
    "rules": [], // 模块
}
```
