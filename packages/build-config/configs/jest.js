const fs = require('fs');
const path = require('path');
const { EXTS, EXT_PATTERN } = require('./constants');

// Package: Run in root
// Workspaces: Run in root
module.exports = function jest(args, tool) {
  const workspacesEnabled = !!tool.package.workspaces;
  const setupFilePath = path.join(process.cwd(), args.setup || './tests/setup.js');
  const setupFiles = [];
  const roots = [];

  if (workspacesEnabled) {
    roots.push('<rootDir>/packages');
  } else {
    roots.push('<rootDir>/src', '<rootDir>/tests');
  }

  if (args.react) {
    setupFiles.push(path.join(__dirname, './jest/enzyme.js'));
  }

  return {
    coverageDirectory: './coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/esm/', '/lib/', '/build/'],
    coverageReporters: ['lcov'],
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
      [`${workspacesEnabled ? './packages/*/' : './'}src/**/*.${EXT_PATTERN}`]: {
        branches: 80,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    globals: {
      __DEV__: true,
    },
    moduleFileExtensions: EXTS.map(ext => ext.slice(1)), // No period
    roots,
    setupFiles,
    setupTestFrameworkScriptFile: fs.existsSync(setupFilePath) ? setupFilePath : undefined,
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testMatch: [`**/?(*.)+(spec|test).${EXT_PATTERN}`],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    verbose: !!args.verbose,
  };
};
