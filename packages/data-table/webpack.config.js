const path = require('path');

const dist = path.resolve(__dirname, './build');
const src = path.resolve(__dirname, './src');

const config = {
  entry: `${src}/index`,
  output: {
    path: `${dist}`,
    filename: 'index.js',
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
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
};

module.exports = config;
