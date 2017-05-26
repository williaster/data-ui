# @data-ui/xy-chart

A package of charts with standard x- and y- axes.

## Components
### Charts
`<XYChart />`

### Axes
`<XAxis />`
`<YAxis />`

### Series
`<VerticalBarSeries />`
`<LineSeries />`
`<IntervalSeries />`

### Other
A subset of [vx](https://github.com/hshoff/vx/blob/master/) gradients and patterns are exported in `@data-ui/xy-chart` to customize the style of series. These components create `<def>` elements in the chart SVG with `id`s that you can reference in another component.

[`<PatternLines />`](https://github.com/hshoff/vx/blob/master/packages/vx-pattern/src/patterns/Lines.js)
[`<LinearGradient />`](https://github.com/hshoff/vx/blob/master/packages/vx-pattern/src/patterns/Lines.js)


#### Example usage

```js
import { XYPlot, VerticalBarSeries, LinearGradient } from '@data-ui/xy-chart';

/// ...
  <XYChart>
    <LinearGradient
      id="my_gradient"
      from={startColor}
      to={endColor}
    />
    <VerticalBarSeries
      data={data}
      fill="url('#my_gradient')"
    />
  </XYChart>
```


## Development
```
npm install
npm run dev # or 'prod'
```
