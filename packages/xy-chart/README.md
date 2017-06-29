# @data-ui/xy-chart
A package of charts with standard x- and y- axes.

<a title="package version" href="https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat-square">
  <img src="https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat-square" />
</a>
<p align="center">
  <img width="600px" src="/assets/xy-chart.gif" />
</p>

See it live at [williaster.github.io/data-ui](https://williaster.github.io/data-ui). More docs soon :v:!

## Example usage
The React `<XYChart />` container coordinates scales across its children and is composable. You can pass it `<XAxis />`, `<YAxis />`, one or more `<*Series />` components, and `<defs>`-based components such as `<LinearGradients />`s and `<PatternLines />`.

Note that the order of children passed to `<XYChart />` determines their rendering order, for example the a `<LineSeries />` passed after a `<BarSeries />` will overlay the line on the bars. The same applies to axes.

```js
import { XYPlot, BarSeries, XAxis, YAxis, LinearGradient } from '@data-ui/xy-chart';

/// ...
  <XYChart
    ariaLabel="Bar chart showing ..."
    width={width}
    height={height}
    margin={{ top, right, bottom, left }}
    xScale={{ type: 'time' }}
    yScale={{ type: 'linear' }}
  >
    <LinearGradient
      id="my_fancy_gradient"
      from={startColor}
      to={endColor}
    />
    <XAxis label="X-axis Label" />
    <YAxis label="Y-axis Label" />
    <BarSeries
      data={timeSeriesData}
      fill="url('#my_fancy_gradient')"
    />
  </XYChart>
```

## Components
### Charts
+ `<XYChart />`

### Axes

+ `<XAxis />`
+ `<YAxis />`

### Series

+ `<BarSeries />`
+ `<LineSeries />`
+ `<PointSeries />`
+ `<StackedBarSeries />`
+ `<GroupedBarSeries />`
+ `<IntervalSeries />`

More coming.

### Other
[`<PatternLines />`](https://github.com/hshoff/vx/blob/master/packages/vx-pattern/src/patterns/Lines.js)
[`<LinearGradient />`](https://github.com/hshoff/vx/blob/master/packages/vx-pattern/src/patterns/Lines.js)

A subset of [vx](https://github.com/hshoff/vx/blob/master/) gradients and patterns are exported in `@data-ui/xy-chart` to customize the style of series. These components create `<def>` elements in the chart SVG with `id`s that you can reference in another component.


## Development
```
npm install
npm run dev # or 'prod'
```

## @data-ui packages
- @data-ui/xy-chart [![Version](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)
- [@data-ui/radial-chart](https://github.com/williaster/data-ui/tree/master/packages/radial-chart) [![Version](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)
- [@data-ui/data-table](https://github.com/williaster/data-ui/tree/master/packages/data-table) [![Version](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)
- [@data-ui/theme](https://github.com/williaster/data-ui/tree/master/packages/theme) [![Version](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)
- [@data-ui/demo](https://github.com/williaster/data-ui/tree/master/packages/demo)
