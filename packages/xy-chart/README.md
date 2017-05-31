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

```js
import { XYPlot, BarSeries, XAxis, YAxis, LinearGradient } from '@data-ui/xy-chart';

/// ...
  <XYChart
    width={width}
    height={height}
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
