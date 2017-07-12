// Export a function instead of an object, the function will accept the base config:
module.exports = (storybookConfig) => {
  // eslint-disable-next-line no-param-reassign
  storybookConfig.plugins = storybookConfig.plugins.filter(plugin => (
    plugin.constructor.name !== 'UglifyJsPlugin' // filter out UglifyJS
  ));

  storybookConfig.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  });

  return storybookConfig;
};
