# data-ui
A collection of custom + wrapped components for data-rich (desktop) UIs. Super beta :baby:

## Packages
+ [@data-ui/xy-chart](https://github.com/williaster/data-ui/tree/master/packages/xy-chart)
+ [@data-ui/data-table](https://github.com/williaster/data-ui/tree/master/packages/data-table)
+ [@data-ui/demo](https://github.com/williaster/data-ui/tree/master/packages/demo)

Lots more coming.

## Live Playground

For examples of the components in action, go to [williaster.github.io/data-ui](https://williaster.github.io/data-ui).

OR

To run that demo on your own computer:
```
git clone ...data-ui && cd data-ui

# bootstrap all packages 
npm install --global lerna@^2.0.0-beta.0
npm install
lerna bootstrap

# alternatively install just the demo package
# cd packages/demo
# npm install 

npm run storybook
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

For easiest development, clone this repo, install `lerna` globally and the root npm modules,
then have lerna install package dependencies and manage the symlinking between packages for you
```
git clone ...data-ui && cd data-ui
npm install --global lerna@^2.0.0-beta.0
npm install
lerna bootstrap
```

Each package defines its own tests which you can run from within a directory with
`npm run test`

To run tests in all packages run the same command from the root @data-ui directory.

## License
[MIT](./LICENSE)
