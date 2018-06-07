const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const webpack = require("webpack");

const commonConfig = require("./webpack.common.js");

module.exports = merge(commonConfig, {
  entry: {
    app: "./client/index.jsx"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                url: false,
                minimize: true,
              },
            },
          ]
        }),
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "css/[name].css",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin({
      // From: https://github.com/facebook/create-react-app/
      uglifyOptions: {
        ecma: 8,
        compress: {
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
        },
        mangle: {
          safari10: true,
        },
        output: {
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true,
        },
      },
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      parallel: true,
      // Enable file caching
      cache: true,
    }),
  ]
});
