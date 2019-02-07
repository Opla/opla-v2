/* eslint import/no-extraneous-dependencies: 0 */
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// eslint-disable-next-line no-undef
module.exports = merge(commonConfig, {
  mode: "development",
  entry: [
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "./client/index.jsx",
  ],
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "./dist/public"), // eslint-disable-line no-undef
    filename: "js/app.js",
    historyApiFallback: true,
    host: "localhost",
    disableHostCheck: true,
    hot: true,
    lazy: false,
    port: 8080,
    publicPath: "/",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: "css/[name].css",
    }),
  ],
});
