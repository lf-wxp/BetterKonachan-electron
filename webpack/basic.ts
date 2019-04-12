import { resolve } from 'path';

export default {
  resolve: {
    alias: {
      '~component': resolve(__dirname, '../assets/src/component'),
      '~util': resolve(__dirname, '../util/index.ts'),
      '~cModule': resolve(__dirname, '../assets/src/module'),
      '~css': resolve(__dirname, '../assets/src/css'),
      '~src': resolve(__dirname, '../assets/src/'),
      '~font': resolve(__dirname, '../assets/src/font'),
      '~image': resolve(__dirname, '../assets/src/image'),
      '~model': resolve(__dirname, '../model'),
      '~module': resolve(__dirname, '../module'),
      '~config': resolve(__dirname, '../config'),
      '~cModel': resolve(__dirname, '../assets/src/model')
    },
    modules: [resolve(__dirname, '../modules'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
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
            limit: 1000
          }
        }]
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          }
        }]
      }
    ]
  }
};
