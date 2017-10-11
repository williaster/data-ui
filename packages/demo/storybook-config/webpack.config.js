/* eslint no-param-reassign: 0 */
// Export a function instead of an object, the function will accept the base config:
module.exports = (storybookConfig) => {
  if (process.env.NODE_ENV !== 'production') {
    storybookConfig.plugins = storybookConfig.plugins.filter(plugin => (
      !(/uglifyjs/i).test(plugin.constructor.name) // filter out UglifyJS
    ));
  }

  storybookConfig.module.rules.push(
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.md$/,
      use: 'raw-loader',
    } // eslint-disable-line comma-dangle
  );

  storybookConfig.node = {
    fs: 'empty',
  };

  return storybookConfig;
};
