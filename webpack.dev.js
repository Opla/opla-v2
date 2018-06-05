const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");

module.exports = merge(commonConfig, {
  entry: [
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "./client/index.jsx",
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
        ]
      },
    ]
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "./dist/public"),
    filename: "js/app.js",
    historyApiFallback: true,
    host: "localhost",
    hot: true,
    lazy: false,
    port: 8080,
    publicPath: "/",
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("dev")
    }),
  ]
});
