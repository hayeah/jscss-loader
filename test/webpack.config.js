const jsscss = require("../lib/index");
const jssLoader = require.resolve("../lib/index");

module.exports = {
  entry: {
    "foo": "./foo.js",
    "bar": "./bar.js",
  },

  module: {
    loaders: [
      {
        test: /\.css.(ts|js)$/,
        loader: jssLoader,
      }
    ],
  },
  output: {
    filename: '[name].js',
    path: "build",
  },
  plugins: [
    new jsscss.ExtractPlugin(),
  ],
}