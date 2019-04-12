import merge from 'webpack-merge';
import basicConfig from './basic';
import path from 'path';

export default merge(basicConfig, {
  entry: './main.ts',
  context: path.resolve(__dirname, '../'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, '../dist')
  },
  devtool: 'cheap-module-eval-source-map',
  target: 'electron-main'
});
