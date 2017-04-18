const path = require('path');

const dist = path.resolve(__dirname, './build');
const src = path.resolve(__dirname, './src');

const config = {
  entry: {
    index: `${src}/index`,
  },
  output: {
    path: `${dist}`,
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: src,
        loader: 'babel-loader',
      },
    ],
  },
};

module.exports = config;
