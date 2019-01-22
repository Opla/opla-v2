/* eslint import/no-extraneous-dependencies: 0 */
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const commonConfig = require("./webpack.common.js");

// eslint-disable-next-line no-undef
module.exports = merge(commonConfig, {
  mode: "production",
  entry: {
    app: "./client/index.jsx",
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 8,
          safari10: true,
          output: {
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
      }),
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "css/[name].css",
    }),
  ],
});
