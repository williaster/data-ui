const { MIN_IE_VERSION, MIN_NODE_VERSION } = require('./constants');

module.exports = function babel(args) {
  const plugins = [
    'babel-plugin-transform-export-extensions',
    ['babel-plugin-transform-dev', { evaluate: false }],
  ];

  if (!args.node) {
    plugins.push([
      // Removes duplicate babel helpers
      'babel-plugin-transform-runtime',
      {
        helpers: true,
        polyfill: true,
        regenerator: false,
      },
    ]);
  }

  // Order is important!
  const presets = [
    [
      'babel-preset-env',
      {
        modules: args.esm ? false : 'commonjs',
        shippedProposals: true,
        targets: args.node ? { node: MIN_NODE_VERSION } : { ie: MIN_IE_VERSION },
        useBuiltIns: 'usage',
      },
    ],
    'babel-preset-stage-2',
  ];

  if (args.react) {
    presets.push('babel-preset-react');
  }

  return {
    babelrc: false,
    comments: false,
    plugins,
    presets,
  };
};
