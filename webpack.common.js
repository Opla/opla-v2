const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "./src/"),
  output: {
    path: path.resolve(__dirname, "./dist/public/js"),
    filename: "app.js",
    publicPath: "/",
    hotUpdateChunkFilename: "hot/hot-update.js",
    hotUpdateMainFilename: "hot/hot-update.json"
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      OplaPlugins: path.resolve(__dirname, "./src/plugins/"),
      OplaLibs: path.resolve(__dirname, "./src/shared/"),
      OplaContainers: path.resolve(__dirname, "./src/shared/containers/"),
      './config': path.resolve(__dirname, './config/default.json')
    },
    modules: [path.join(__dirname, "src"), "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: "./public",
        to: path.resolve(__dirname, "./dist/public"),
        force: true
      },
      {
        from: "./server",
        to: path.resolve(__dirname, "./dist"),
        force: true
      },
      {
        from: path.resolve(__dirname, "./package.json"),
        to: path.resolve(__dirname, "./dist/package.json"),
        force: true
      }
    ])
  ]
};
