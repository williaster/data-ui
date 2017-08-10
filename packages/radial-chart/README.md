# @data-ui/radial-chart

demo at <a href="https://williaster.github.io/data-ui" target="_blank">williaster.github.io/data-ui</a>

## Overview
This package exports declarative react `<RadialChart />`s implemented with <a href="vx-demo.now.sh" target="_blank">@vx</a> which can be used to render both donut and pie charts depending on props. As demonstrated in the demo, in combination with [@vx/legend](https://vx-demo.now.sh/legends) and
<a href="https://github.com/hshoff/vx/tree/master/packages/vx-scale" target="_blank">@vx/scale</a> these can be used to create re-usable radial charts.

### Usage
See the demo at <a href="https://williaster.github.io/data-ui" target="_blank">williaster.github.io/data-ui</a> for more example outputs.

<img width="550" alt="Donut chart" src="https://user-images.githubusercontent.com/4496521/27712141-839c1adc-5cda-11e7-829e-af3b6abb1bdc.png">

```js
import { scaleOrdinal } from '@vx/scale';
import { LegendOrdinal } from '@vx/legend';

import { colors } from '@data-ui/theme';
import { RadialChart, ArcSeries, ArcLabel } from '@data-ui/radial-chart';

const colorScale = scaleOrdinal({ range: colors.categories });

export default () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <RadialChart
      ariaLabel="This is a radial-chart chart of..."
      width={width}
      height={height}
      margin={{ top, right, bottom, left }}
    >
      <ArcSeries
        data={data}
        pieValue={d => d.value}
        fill={arc => colorScale(arc.data.label)}
        stroke="#fff"
        strokeWidth={1}
        label{arc => `${(arc.data.value).toFixed(1)}%`}
        labelComponent={<ArcLabel />}
        innerRadius={radius => 0.35 * radius}
        outerRadius={radius => 0.6 * radius}
        labelRadius={radius => 0.75 * radius}
      />
    </RadialChart>
    <LegendOrdinal
      direction="column"
      scale={colorScale}
      shape="rect"
      fill={({ datum }) => colorScale(datum)}
      labelFormat={label => label}
    />
  </div>
);

```

### Roadmap
- more types of radial series
- interactions (eg tooltips)
- animations / transitions

### NOTE ‼️
Although pie 🍰 and donut 🍩 charts are frequently encountered, they are not the most _effective_ visualization for conveying quantitative information. With that caveat, when used well they can effectively give an overview of population makeup which is an entirely reasonable use of these charts. We don't recommend using >7 slices for user readability.


## @data-ui packages
- <a href="https://github.com/williaster/data-ui/tree/master/packages/xy-chart" target="_blank">@data-ui/xy-chart</a>[![Version](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/xy-chart.svg?style=flat)
- @data-ui/radial-chart [![Version](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/radial-chart.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-table" target="_blank">@data-ui/data-table</a> [![Version](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/data-table.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/data-ui-theme" target="_blank">@data-ui/theme</a> [![Version](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)](https://img.shields.io/npm/v/@data-ui/theme.svg?style=flat)
- <a href="https://github.com/williaster/data-ui/tree/master/packages/demo" target="_blank">@data-ui/demo</a>
