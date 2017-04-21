# data-ui
A collection of custom + wrapped components for data-rich (desktop) UIs. Super beta :baby:

## Packages
- [@data-ui/data-table](https://github.com/williaster/data-ui/tree/master/packages/data-table)
- [@data-ui/demo](https://github.com/williaster/data-ui/tree/master/packages/demo)

Lots more coming.

## Live Playground

For examples of the components in action, go to https://williaster.github.io/data-ui.

OR

To run that demo on your own computer:
```
# clone this repository
cd demo
npm install
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

## License
[MIT](./LICENSE)
