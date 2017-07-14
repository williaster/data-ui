# @data-ui/xy-chart
A package of charts with standard x- and y- axes.

<a title="package version" href="https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat-square">
  <img src="https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat-square" />
</a>
<p align="center">
  <img width="600px" src="https://raw.githubusercontent.com/williaster/data-ui/master/assets/xy-chart.gif" />
</p>

See it live at <a href="https://williaster.github.io/data-ui" target="_blank">williaster.github.io/data-ui</a>.

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
- `<XYChart />`

### Axes
- `<XAxis />`
- `<YAxis />`

### Series
- `<BarSeries />`
- `<LineSeries />`
- `<PointSeries />`
- `<StackedBarSeries />`
- `<GroupedBarSeries />`
- `<IntervalSeries />`

More on the way.

### Other
- <a href="https://github.com/hshoff/vx/blob/master/packages/vx-pattern/src/patterns/Lines.js" target="_blank">`<PatternLines />`</a>
- <a href="https://github.com/hshoff/vx/blob/master/packages/vx-gradient/src/gradients/LinearGradient.js" target="_blank">`<LinearGradient />`</a>

A subset of <a href="https://github.com/hshoff/vx/blob/master/" target="_blank">vx</a> gradients and patterns are exported in `@data-ui/xy-chart` to customize the style of series. These components create `<def>` elements in the chart SVG with `id`s that you can reference in another component.

## Development
```
npm install
npm run dev # or 'build'
```

## @data-ui packages
- @data-ui/xy-chart
- <a href="https://github.com/williaster/data-ui/tree/master/packages/radial-chart" target="_blank">@data-ui/radial-chart</a> [![Version](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-table" target="_blank">@data-ui/data-table</a> [![Version](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-ui-theme" target="_blank">@data-ui/theme</a> [![Version](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/demo" target="_blank">@data-ui/demo</a>
