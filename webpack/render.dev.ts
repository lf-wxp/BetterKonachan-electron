import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
//@ts-ignore
import webpackDevServer from 'webpack-dev-server';
import basicConfig from './basic';
import webpack from 'webpack';
import path from 'path';

export default merge(basicConfig, {
  mode: 'development',
  entry: { index: './index.tsx' },
  context: path.resolve(__dirname, '../assets/src/'),
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
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../assets/src/index.html')
    }),
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin() // prints more readable module names in the browser console on HMR updates
  ],
  performance: {
    hints: false
  }
});
