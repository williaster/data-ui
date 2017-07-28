# @data-ui/histogram

A React + d3 library for creating histograms.

`npm install --save @data-ui/histogram`


### Example usage

```javascript
import { Histogram, DensitySeries, BarSeries, CircleSeries } from '@data-ui/histogram';

...
render () {
  return (
    <Histogram
      ariaLabel="My histogram of ..."
      width={400}
      height={300}
      orientation="vertical"
      cumulative={false}
    >
      <BarSeries
        rawData={normallyDistributedData}
        dataValue={accessor}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </Histogram>
  );
}
```
