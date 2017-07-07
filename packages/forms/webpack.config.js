const path = require('path');
const webpack = require('webpack');

const dist = path.resolve(__dirname, './build');
const src = path.resolve(__dirname, './src');

const config = {
  entry: {
    index: `${src}/index`,
  },
  output: {
    filename: '[name].js',
    path: `${dist}`,
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: src,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        loader: 'babel!react-svg',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
  ],
};

module.exports = config;
