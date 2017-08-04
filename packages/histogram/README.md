# @data-ui/histogram

A React + d3 library for creating histograms. Vertical or horizontal, raw data or binned data, numeric or categorical bins, counts or densities, cumulative or not.

`npm install --save @data-ui/histogram`

<a title="package version" href="https://img.shields.io/npm/v/@data-ui/histogram.svg?style=flat-square">
  <img src="https://img.shields.io/npm/v/@data-ui/histogram.svg?style=flat-square" />
</a>

Demo it live at <a href="https://williaster.github.io/data-ui" target="_blank">williaster.github.io/data-ui</a>.

## Example usage
Similar to the `@data-ui/xy-chart` package, this `@data-ui/histogram` package exports a parent `<Histogram />` container component that renders an svg and coordinates scales across its children. You can pass the parent container optionally-animated `<BarSeries />` and/or `<DensitySeries />` as well as `<XAxis />` and `<YAxis />`.

```javascript
import { Histogram, DensitySeries, BarSeries, withParentSize } from '@data-ui/histogram';

const ResponsiveHistogram = withParentSize({ parentWidth, ...rest}) => (
  <Histogram
    width={parentWidth}
    height={parentWidth * aspectRatio}
    {...rest}
  />
);

...
  render () {
    return (
      <ResponsiveHistogram
        ariaLabel="My histogram of ..."
        orientation="vertical"
        cumulative={false}
        normalized={true}
        binCount={25}
        valueAccessor={datum => datum.value}
        binType="numeric"
      >
        <BarSeries
          animated
          rawData={data /* or binnedData={data} */}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        <BarSeries  
          animated
          rawData={data /* or binnedData={data} */}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        <XAxis />
        <YAxis />
      </Histogram>
    );
  }
```

Demo with the <a href="https://williaster.github.io/data-ui" target="_blank">Histogram playground</a>.

## Components

Check out the example source code and PropTable tabs in the Storybook <a href="https://williaster.github.io/data-ui" target="_blank">williaster.github.io/data-ui</a>.

### <Histogram />
Name | Type | Default | Description 
------------ | ------------- | ------- | ---- 
ariaLabel | PropTypes.string.isRequired | - | Accessibility label
binValues | PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])) | null | Bin thresholds, overrides binCount
binCount | PropTypes.number | 10 | an approximate number of bins to use (if data is not already binned)
binType | PropTypes.oneOf(['numeric', 'categorical']) | 'numeric' | Specify whether to bins are categorical or numeric
children | PropTypes.node.isRequired | - | Child Series, Axis, or other
cumulative | PropTypes.bool | false | whether to show a cumulative histogram
height | PropTypes.number.isRequired | - | height of the visualization
horizontal | PropTypes.bool | false | whether the histograms is oriented vertically or horizontally
limits | PropTypes.array | null | values outside the limits are ignored
margin | PropTypes.shape({ top: PropTypes.number, right: PropTypes.number, bottom: PropTypes.number, left: PropTypes.number }) | { top: 32, right: 32, bottom: 64, left: 64 } | chart margin, leave room for axes and labels!
normalized | PropTypes.bool | false | whether the value axis is normalized as fraction of total
theme | PropTypes.object | {} | chart theme
width | PropTypes.number.isRequired | - | width of the svg
valueAccessor | PropTypes.func | d => d | for raw data, how to access the bin value

### Series
`<BarSeries />` and `<DensitySeries />` components accept _either_ `rawData` or `binnnedData`. Raw data can be in any format as long as the value of each datum can be accessed with the Histogram `valueAccessor` function. Binned data should have the following shapes:

```javascript
export const numericBinnedDatumShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  bin0: PropTypes.number.isRequired,
  bin1: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
});

export const categoricalBinnedDatumShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  bin: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
});
```

If both `rawData` and `binnnedData` are provided, `rawData` is ignored.

### <BarSeries />
Name | Type | Default | Description 
------------ | ------------- | ------- | ---- 
animated | PropTypes.bool | true | whether to animate updates to the data in the series
rawData | PropTypes.array | [] | raw datum
binnedData | binnedDataShape | [] | binned data
fill | PropTypes.oneOfType([PropTypes.func, PropTypes.string]) | @data-ui/theme.color.default | determines bar fill color
fillOpacity | PropTypes.oneOfType([PropTypes.func, PropTypes.number]) | 0.7 | opacity of bar fill
stroke | PropTypes.oneOfType([PropTypes.func, PropTypes.string]) | 'white' | determines bar stroke color
strokeWidth | PropTypes.oneOfType([PropTypes.func, PropTypes.number]) | 1 | determines width of bar outline

### <DensitySeries />
For _raw data_ that is _numeric_, the `<DensitySeries />` plots an estimates of the probability density function, i.e., a kernel density estimate. If pre-aggregated and/or categorical data is passed to the Series, it plots an Area graph of values based on the data counts.

Name | Type | Default | Description 
------------ | ------------- | ------- | ---- 
animated | PropTypes.bool | true | whether to animate updates to the data in the series
rawData | PropTypes.array | [] | raw datum
binnedData | binnedDataShape | [] | binned data
fill | PropTypes.oneOfType([PropTypes.func, PropTypes.string]) | @data-ui/theme.color.default | determines bar fill color
kernel | PropTypes.oneOf(['gaussian', 'parabolic']) | 'gaussian' | kernel function type, parabolic = epanechnikov kernel
showArea | PropTypes.bool | true | whether to show density area fill
showLine | PropTypes.bool | true | whether to show density line path
smoothing | PropTypes.number | 1 | smoothing constant for parabolic / epanechinikov kernel function
fillOpacity | PropTypes.oneOfType([PropTypes.func, PropTypes.number]) | 0.7 | opacity of area fill if shown
stroke | PropTypes.oneOfType([PropTypes.func, PropTypes.string]) | 'white' | determines line color if shown
strokeWidth | PropTypes.oneOfType([PropTypes.func, PropTypes.number]) | 2 | determines width of line path if shown
strokeDasharray | PropTypes.oneOfType([PropTypes.func, PropTypes.string]) | '' | determines dash pattern of line if shown
strokeLinecap | PropTypes.oneOf(['butt', 'square', 'round', 'inherit']) | 'round' | style of line path stroke
useEntireScale | PropTypes.bool | false | if true, density plots will scale to fill the entire y-range of the plot. if false, the maximum value is scaled to the count of the series

### <*Axis />

Name | Type | Default | Description 
------------ | ------------- | ------- | ---- 
axisStyles | axisStylesShape | {} | config object for axis and axis label styles
label | PropTypes.oneOfType([PropTypes.string, PropTypes.element]) | <text {...axisStyles.label[orientation]} /> | string or component for axis labels
numTicks | PropTypes.number | null | approximate number of ticks
orientation | XAxis PropTypes.oneOf(['bottom', 'top']) or YAxis PropTypes.oneOf(['left', 'right']) | bottom, left | orientation of axis
tickStyles | tickStylesShape | {} | config object for styling ticks and tick labels
tickLabelComponent | PropTypes.element | <text {...tickStyles.label[orientation]} /> | component to use for tick labels
tickFormat | PropTypes.func | null | (tick, tickIndex) => formatted tick
tickValues | PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])) | null | custom tick values

## Development
```
npm install
npm run dev # or 'build'
```

## @data-ui packages
- <a href="https://github.com/williaster/data-ui/tree/master/packages/xy-chart" target="_blank">@data-ui/xy-chart</a> [![Version](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)
- @data-ui/histogram [![Version](https://img.shields.io/npm/v/@data-ui/histogram.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/histogram.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/radial-chart" target="_blank">@data-ui/radial-chart</a> [![Version](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-table" target="_blank">@data-ui/data-table</a> [![Version](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-ui-theme" target="_blank">@data-ui/theme</a> [![Version](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/demo" target="_blank">@data-ui/demo</a>
