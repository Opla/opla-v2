const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "./src/"),
  entry: {
    app: "./client/index.jsx"
  },
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
      MdlExt: path.resolve(__dirname, "./src/shared/components/mdl/")
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
          options: {
            presets: ["es2015", "react", "stage-1"],
            plugins: [
              ["transform-runtime", { "polyfill": false }],
              "transform-regenerator",
              "react-hot-loader/babel",
              "transform-decorators-legacy"
            ],
            env: {
              start: {
                presets: ["react-hmre"]
              }
            }
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
    }),
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
