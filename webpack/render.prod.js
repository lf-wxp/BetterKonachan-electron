const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const basicConfig = require('./basic');
const path = require('path');

module.exports = merge(basicConfig, {
  mode: 'production',
  entry: {
    index: './index.tsx'
  },
  context: path.resolve(__dirname, '../assets/src/'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: './',
    // path: path.resolve(__dirname, 'dist')
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, '../assets/src/index.html') }),
  ],
});
