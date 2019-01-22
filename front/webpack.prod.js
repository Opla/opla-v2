/* eslint import/no-extraneous-dependencies: 0 */
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

const commonConfig = require("./webpack.common.js");

// eslint-disable-next-line no-undef
module.exports = merge(commonConfig, {
  mode: "production",
  entry: {
    app: "./client/index.jsx",
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "css/[name].css",
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
  ],
});
