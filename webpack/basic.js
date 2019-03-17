const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.tsx',
  resolve: {
    alias: {
      '~component': resolve(__dirname, '../assets/src/component'),
      '~service': resolve(__dirname, '../assets/src/service.ts'),
      '~cModule': resolve(__dirname, '../assets/src/module'),
      '~css': resolve(__dirname, '../assets/src/css'),
      '~src': resolve(__dirname, '../assets/src/'),
      '~font': resolve(__dirname, '../assets/src/font'),
      '~image': resolve(__dirname, '../assets/src/image'),
      '~model': resolve(__dirname, '../model'),
      '~cModel': resolve(__dirname, '../assets/src/model'),
    },
    modules: [resolve(__dirname, '../modules'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  context: resolve(__dirname, '../assets/src/'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['awesome-typescript-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        }, 'postcss-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 1000,
          },
        },],
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: resolve(__dirname, '../assets/src/index.html') }),
  ],
  performance: {
    hints: false,
  },
};
