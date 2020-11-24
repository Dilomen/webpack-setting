const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const commonOption = require("./webpack.common");
const { createTemplete, getAbsPath, checkFileExist } = require("./util");

createTemplete();
let tempExist = checkFileExist();
const cssModuleLoader = {
  loader: "css-loader",
  options: {
    modules: {
      localIdentName: "[local]_[hash:5]",
    },
  },
};

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    config: {
      path: path.resolve(__dirname, "./postcss.config.js"),
    },
  },
};

// 可以在ts文件中使用css-module的方式import引入css,放到css-loader前端
// loaders: ['style-loader', typingForCSSModuleLoader, cssModuleLoader, postcssLoader, 'sass-loader'],
// 原理是生成一个css对应的d.ts的声明文件，由于在JS中也会生成对应的d.ts文件，所以，该loader适合纯ts项目，不建议在含有js的项目中使用，所以暂时注释
// ts中可import './*.css'或const css = require('./*.css')
const typingForCSSModuleLoader = {
  loader: "@teamsupercell/typings-for-css-modules-loader",
  options: {
    formatter: "prettier",
  },
};

let devDefaultOption = {
  devtool: "cheap-module-eval-source-map",
  plugin: {
    // new webpack.NamedModulesPlugin(),
    HtmlWebpackPlugin: {
      plugin: HtmlWebpackPlugin,
      args: [
        {
          filename: "index.html",
          template: tempExist
            ? path.resolve(process.cwd(), "./index.html")
            : path.resolve(__dirname, "./index.html"),
        }
      ]
    },
    HotModuleReplacementPlugin: {
      plugin: webpack.HotModuleReplacementPlugin,
    }
  },
  module: {
    rule: [
      {
        test: /\.scss$/,
        loaders: [
          "style-loader",
          cssModuleLoader,
          postcssLoader,
          "sass-loader",
        ],
        include: [getAbsPath("src")],
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", postcssLoader, "sass-loader"],
        include: [getAbsPath("node_modules")],
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", cssModuleLoader, postcssLoader],
        include: [getAbsPath("src")],
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader", postcssLoader],
        include: [getAbsPath("node_modules")],
      },
    ],
  },
  mode: "development",
}
const uniteOptions = webpackMerge(devDefaultOption, commonOption)

module.exports = require('./mergeOptions')(uniteOptions);
