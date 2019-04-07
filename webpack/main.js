const merge = require('webpack-merge');
const basicConfig = require('./basic');
const path = require('path');

module.exports = merge(basicConfig, {
  entry: './main.ts',
  context: path.resolve(__dirname, '../'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, '../dist')
  },
  devtool: 'cheap-module-eval-source-map',
  target: 'electron-main',
});
