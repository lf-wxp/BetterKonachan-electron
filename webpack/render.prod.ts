import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import basicConfig from './basic';
import path from 'path';

export default merge(basicConfig, {
  mode: 'production',
  entry: {
    index: './index.tsx'
  },
  context: path.resolve(__dirname, '../assets/src/'),
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: './'
    // path: path.resolve(__dirname, 'dist')
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../assets/src/index.html')
    })
  ]
});
