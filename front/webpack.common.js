const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname, "./src/"),
  output: {
    path: path.resolve(__dirname, "./dist/public"),
    filename: "js/app.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "./config": path.resolve(__dirname, "./config/default.json")
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
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              minimize: process.env.NODE_ENV === "production" ? true : false,
            },
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: [path.resolve(__dirname, './src')]
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./public/images",
        to: path.resolve(__dirname, "./dist/public/images"),
        force: true
      },
      {
        from: "./public/favicon.ico",
        to: path.resolve(__dirname, "./dist/public/favicon.ico"),
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
      },
      {
        from: "./public/bot.html",
        to: path.resolve(__dirname, "./dist/public/bot.html"),
        force: true
      }
    ]),
    new HtmlWebpackPlugin({
      filename: "index.html",
      path: path.resolve(__dirname, "./dist/public"),
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        APP: {
          subname: JSON.stringify(process.env.APP_SUBNAME),
          version: JSON.stringify(process.env.APP_VERSION),
          build: JSON.stringify(process.env.APP_BUILD),
          instance: {
            name: JSON.stringify(process.env.APP_INSTANCE_NAME),
            color: JSON.stringify(process.env.APP_INSTANCE_COLOR),
            description: JSON.stringify(process.env.APP_INSTANCE_DESCRIPTION),
          },
        },
      },
    }),
  ]
};
