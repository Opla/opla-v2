const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");

module.exports = merge(commonConfig, {
  entry: [
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "react-hot-loader/patch",
    "./client/index.jsx",
  ],
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, "./dist/public"),
    port: 8080,
    host: "localhost",
    lazy: false,
    publicPath: "/",
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader?modules",],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
  ]
});
