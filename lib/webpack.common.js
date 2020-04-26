const path = require("path");
const babelOption = require("./babel.config");
const package_json = require(path.resolve(process.cwd(), "./package.json"));
const webpack = require("webpack");
const { config = {} } = package_json;
const merge = require('webpack-merge');
const threadLoader = require('thread-loader');
const jsWorkerPool = {
  workers: 2,
  poolTimeout: 2000
};
threadLoader.warmup(jsWorkerPool, ['babel-loader']);
const {
  rules = [],
  output = {},
  plugins = [],
  entry = "",
  providePlugin = {},
  alias = {},
} = config;
const { createAliasObj, checkFileExist } = require("./util");
let commonOption = {
  //process.cwd()返回运行当前脚本的工作目录的路径
  entry: [path.resolve(process.cwd(), entry || "./src/")],
  output: {
    path: path.resolve(process.cwd(), "./build"),
    filename: "[hash:8].js",
    ...output,
  },
  // 方便调试
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      src: path.resolve(process.cwd(), "./src"),
      components: path.resolve(process.cwd(), "./src/components"),
      utils: path.resolve(process.cwd(), "./src/utils"),
      assets: path.resolve(process.cwd(), "./src/assets"),
      common: path.resolve(process.cwd(), "./src/common"),
      base: path.resolve(process.cwd(), "./src/base"),
      ...createAliasObj(alias),
    },
  },
  plugins: [
    // 自动加载模块，而不必到处 import 或 require
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
      Fragment: ["react", "Fragment"],
      PureComponent: ["react", "PureComponent"],
      Component: ["react", "Component"],
      Classnames: ["classnames/bind"],
      ...providePlugin,
    }),
    ...plugins,
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: jsWorkerPool
          },
          {
            loader: "babel-loader",
            options: {
              ...babelOption(),
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'cache-loader',
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "./tsconfig.json"),
            },
          }
        ],
      },
      {
        test: /\.(jpe?g|png|woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
            },
          },
        ]
      },
      {
        test: /.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/, // 可在svg文件后加?inline， import SVG from icon.svg?inline
            use: "url-loader",
          },
          {
            use: "raw-loader",
          },
        ],
      },
      ...rules,
    ],
  },
};

if (checkFileExist(path.resolve(process.cwd(), "./webpack.config.js"))) {
  const webpackConfig = require(path.resolve(process.cwd(), "./webpack.config.js"));
  webpackConfig.changeDefault && (option = webpackConfig.changeDefault(option) || option)
  commonOption = merge(commonOption, webpackConfig.options)
}

module.exports = commonOption;
