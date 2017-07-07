// Export a function instead of an object, the function will accept the base config:
module.exports = (storybookConfig) => {
  // eslint-disable-next-line no-param-reassign
  storybookConfig.plugins = storybookConfig.plugins.filter(plugin => (
    plugin.constructor.name !== 'UglifyJsPlugin' // filter out UglifyJS
  ));

  storybookConfig.module.loaders.push(
    { test: /\.css$/, loader: 'style-loader!css-loader' } // eslint-disable-line comma-dangle
  );

  return storybookConfig;
};
