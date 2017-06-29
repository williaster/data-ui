<p align="center">
  <a title="package version" href="https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat-square">
    <img src="https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat-square" />
  </a>
</p>

# @data-ui/data-table

Performant table components that can handle a lot of data.
Wraps [react-virtualized](https://github.com/bvaughn/react-virtualized) and provides a lot
of HOC wrappers for flexibility.

## Styles
This library doesn't override any styles or classnames from the base `react-virtualized` libray,
which you can read more about
[here](https://github.com/bvaughn/react-virtualized/blob/master/docs/customizingStyles.md).

For convenience the base `react-virtualized` stylesheet is coppied for import with the
appropriate loader via
`import '@data-ui/data-table/build/styles.css';`

Alternatively you can pass table, header, row classNames or style objects to the wrapped <Table/> component.
See the [@data-ui/demo](https://github.com/williaster/data-ui/tree/master/packages/demo) for examples of the latter.

## Development
```
npm install
npm run dev # or 'npm run prod'
```

## @data-ui packages
- [@data-ui/xy-chart](https://github.com/williaster/data-ui/tree/master/packages/xy-chart) [![Version](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat-square)](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat-square)
- [@data-ui/radial-chart](https://github.com/williaster/data-ui/tree/master/packages/radial-chart) [![Version](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat-square)](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat-square)
- @data-ui/data-table [![Version](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat-square)](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat-square)
- [@data-ui/theme](https://github.com/williaster/data-ui/tree/master/packages/theme)
- [@data-ui/demo](https://github.com/williaster/data-ui/tree/master/packages/demo)
