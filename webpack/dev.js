const merge = require('webpack-merge');
const webpack = require('webpack');
const basicConfig = require('./basic');

module.exports = merge(basicConfig, {
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:9999',
    'webpack/hot/only-dev-server',
    './index.tsx'
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    globalObject: 'this'
    // path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    hot: true, // enable HMR on the server
    port: 9999,
    host: '0.0.0.0',
    historyApiFallback: true,
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
  ],
});
