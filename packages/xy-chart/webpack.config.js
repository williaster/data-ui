const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');

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
    ],
  },
  plugins: [
    new DashboardPlugin(),
  ],
};

module.exports = config;
