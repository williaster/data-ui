<p align="center">
  <a title="package version" target="_blank" href="https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat-square">
    <img src="https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat-square" />
  </a>
</p>

# @data-ui/data-table

Performant table components that can handle a lot of data.
Wraps [react-virtualized](https://github.com/bvaughn/react-virtualized) and provides a lot
of HOC wrappers for flexibility. See it live at <a href="https://williaster.github.io/data-ui" target="_blank">williaster.github.io/data-ui</a>

## Styles
This library doesn't override any styles or classnames from the base `react-virtualized` libray, which you can read more about <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/customizingStyles.md" target="_blank">in that repo</a>

For convenience the base `react-virtualized` stylesheet is copied for import with the appropriate loader via
`import '@data-ui/data-table/build/styles.css';`

Alternatively you can pass table, header, row classNames or style objects to the wrapped `<Table/>` component exported by this library.
See the <a href="https://williaster.github.io/data-ui" target="_blank">@data-ui/demo</a> (<a href="https://github.com/williaster/data-ui/tree/master/packages/demo" target="_blank">source</a>) for examples of the latter.

## Development
```
npm install
npm run dev # or 'npm run prod'
```

## @data-ui packages
- <a href="https://github.com/williaster/data-ui/tree/master/packages/xy-chart" target="_blank">@data-ui/xy-chart</a>[![Version](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/radial-chart" target="_blank">@data-ui/radial-chart</a> [![Version](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)
- @data-ui/data-table [![Version](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-ui-theme" target="_blank">@data-ui/theme</a> [![Version](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/demo" target="_blank">@data-ui/demo</a>
