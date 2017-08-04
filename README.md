# data-ui
A collection of custom + wrapped components for data-rich (desktop) UIs. Super beta :baby:

<p>
  <a title="build status" href="https://travis-ci.org/williaster/data-ui.svg?branch=master">
    <img src="https://travis-ci.org/williaster/data-ui.svg?branch=master" />
  </a>
  <a href='https://coveralls.io/github/williaster/data-ui?branch=master'>
    <img src='https://coveralls.io/repos/github/williaster/data-ui/badge.svg?branch=master' alt='Coverage Status' />
  </a>
</p>

demo at [williaster.github.io/data-ui](https://williaster.github.io/data-ui) :chart_with_upwards_trend:

## Packages
- [@data-ui/xy-chart](https://github.com/williaster/data-ui/tree/master/packages/xy-chart) [![Version](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)
- [@data-ui/histogram](https://github.com/williaster/data-ui/tree/master/packages/histogram) [![Version](https://img.shields.io/npm/v/@data-ui/histogram.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/histogram.svg?style=flat)
- [@data-ui/radial-chart](https://github.com/williaster/data-ui/tree/master/packages/radial-chart) [![Version](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)
- [@data-ui/event-flow](https://github.com/williaster/data-ui/tree/master/packages/event-flow) [![Version](https://img.shields.io/npm/v/@data-ui/event-flow.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/event-flow.svg?style=flat)
- [@data-ui/data-table](https://github.com/williaster/data-ui/tree/master/packages/data-table) [![Version](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)
- [@data-ui/theme](https://github.com/williaster/data-ui/tree/master/packages/theme) [![Version](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)
- [@data-ui/demo](https://github.com/williaster/data-ui/tree/master/packages/demo)

More coming.

## Live Playground

For examples of the components in action, go to [williaster.github.io/data-ui](https://williaster.github.io/data-ui).

OR

To run that demo on your own computer:
```sh
git clone ...data-ui && cd data-ui

# instal root dependencies including lerna
npm install 
# bootstrap (symlink inter-dependencies) all packages
lerna bootstrap

# alternatively install just the demo package
# cd packages/demo
# npm install

# go to the demo package and start storybook
cd packages/demo
npm run dev
# visit http://localhost:9001/
```

## Development
[lerna](https://github.com/lerna/lerna/) is used to manage versions and dependencies between
packages in this repo.

```
data-ui/
  lerna.json
  package.json
  packages/
    package1/
      src/
      test/
      build/
      package.json
      ...
    ...
```

For easiest development, clone this repo, install the root npm modules including lerna,
then have lerna install package dependencies and manage the symlinking between packages for you
```sh
git clone ...data-ui && cd data-ui
npm install
lerna bootstrap
```

Enzyme and jest are used for testing. Each package defines its own tests, which you can run from within a `packages/package-name` directory using
```sh
cd packages/my-package
npm run test
```

for a single test or subset of tests run
```sh
npm run test -t regex
```

To run all tests in all packages run `lerna run test` from the root @data-ui directory.

## License
[MIT](./LICENSE)
