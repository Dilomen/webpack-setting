const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const merge = require("webpack-merge");
const commonOption = require("./webpack.common");
const { checkFileExist, createTemplete } = require("./util");
createTemplete();
let result = checkFileExist();
let external = {}
try {
  external = require(path.resolve(process.cwd(), "./webpack.prod.js"));
} catch(err) {
  external = {}
}

let option = merge(
  {
    // devtool: 'cheap-module-source-map',
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[name].css",
        ...(external.CssExtractConfig || {})
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: result
          ? path.resolve(process.cwd(), "./index.html")
          : path.resolve(__dirname, "./index.html"),
        ...(external.HTMLExtractConfig || {})
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
        },
        parallel: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.s?[ac]ss$/,
          loaders: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: "./" },
            },
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[local]_[hash:5]",
                },
              },
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: path.resolve(__dirname, "./postcss.config.js"),
                },
              },
            },
            "sass-loader",
          ],
        },
      ],
    },
    mode: "production",
    // optimization: {
    //   // 合并CSS样式
    //   minimizer: [new OptimizeCSSAssetsPlugin({})],
    //   // 代码分割
    //   splitChunks: {
    //     chunks: 'all',
    //     minSize: 30000,
    //     minChunks: 1,
    //     maxAsyncRequests: 5,
    //     maxInitialRequests: 3,
    //     automaticNameDelimiter: '~',
    //     name: true,
    //     cacheGroups: {
    //       vendors: {
    //         test: /[\\/]node_modules[\\/]/,
    //         priority: -10,
    //         filename: 'vendors.js'
    //       },
    //       default: {
    //         priority: -20,
    //         reuseExistingChunk: true,
    //         filename: 'common.js'
    //       }
    //     }
    //   }
    // }
  },
  commonOption
);

if (checkFileExist(path.resolve(process.cwd(), "./webpack.prod.js"))) {
  const { webpackConfig } = require(path.resolve(
    process.cwd(),
    "./webpack.prod.js"
  ));
  webpackConfig && (webpackConfig(option) || option);
}

module.exports = option;
