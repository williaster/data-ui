module.exports = {
  babelrc: false,
  comments: false,
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: false,
        useESModules: true,
      },
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        shippedProposals: true,
        targets: {
          ie: 10,
        },
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ],
};
