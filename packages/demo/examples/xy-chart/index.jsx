import React from 'react';

import mockData from '@vx/mock-data';
import {
  XYChart,
  LineSeries,
  LinearGradient,
  theme,
  VerticalBarSeries,
  XAxis,
  YAxis,
  withScreenSize,
} from '../../../xy-chart/build';

const ResponsiveXYChart = withScreenSize(({ screenWidth, children, ...rest }) => (
  <XYChart
    theme={theme}
    width={screenWidth / 1.5}
    height={screenWidth / 1.5 / 2}
    {...rest}
  >
    {children}
  </XYChart>
));

const data = mockData.appleStock.filter((d, i) => i % 120 === 0).map(d => ({
  x: new Date(d.date),
  y: d.close,
}));

export default [
  {
    description: 'time bar chart',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        scales={{
          x: { type: 'time' },
          y: { type: 'linear', includeZero: true },
        }}
      >
        <LinearGradient
          id="aqua_lightaqua_gradient"
          from="#00A699"
          to="#84D2CB"
        />
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'bar and line chart',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        scales={{
          x: { type: 'time' },
          y: { type: 'linear', includeZero: true },
        }}
      >
        <LinearGradient
          id="aqua_lightaqua_gradient"
          from="#00A699"
          to="#84D2CB"
        />
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <LineSeries
          data={data}
          label="Apple Stock"
          stroke="#484848"
        />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'time bar chart with axes',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        scales={{
          x: { type: 'time' },
          y: { type: 'linear', includeZero: true },
        }}
      >
        <YAxis label="Price ($)" numTicks={4} />
        <LinearGradient
          id="aqua_lightaqua_gradient"
          from="#00A699"
          to="#84D2CB"
        />
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <XAxis label="Time" numTicks={5} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'time bar chart with inverted axes',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        scales={{
          x: { type: 'time' },
          y: { type: 'linear', includeZero: true },
        }}
      >
        <YAxis label="Price ($)" numTicks={4} orientation="left" />
        <LinearGradient
          id="aqua_lightaqua_gradient"
          from="#00A699"
          to="#84D2CB"
        />
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <XAxis label="Time" numTicks={5} orientation="top" />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'line chart',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        scales={{
          x: { type: 'time' },
          y: { type: 'linear', includeZero: true },
        }}
      >
        <YAxis label="Price ($)" numTicks={4} />
        <LineSeries
          data={data}
          label="Apple Stock"
          showPoints
        />
        <LineSeries
          data={data.map(d => ({ ...d, y: Math.random() > 0.5 ? d.y * 2 : d.y / 2 }))}
          label="Apple Stock 2"
          stroke="#484848"
          strokeDasharray="3 3"
        />
        <XAxis label="Time" numTicks={5} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'categorical bar chart',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        scales={{
          x: { type: 'band' },
          y: { type: 'linear', includeZero: true },
        }}
      >
        <LinearGradient
          id="aqua_lightaqua_gradient"
          from="#00A699"
          to="#84D2CB"
        />
        <VerticalBarSeries
          data={data.map((d, i) => ({ ...d, x: 'abcdefghijklmnopqrstuvwxyz'[i % 26] }))}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <XAxis numTicks={data.length} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'non-zero y-axis',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        scales={{
          x: { type: 'time' },
          y: { type: 'linear' },
        }}
      >
        <YAxis label="$$$" numTicks={4} />
        <LinearGradient
          id="aqua_lightaqua_gradient"
          from="#00A699"
          to="#84D2CB"
        />
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <XAxis numTicks={0} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'no theme',
    example: () => (
      <ResponsiveXYChart
        theme={{}}
        ariaLabel="Required label"
        scales={{
          x: { type: 'time' },
          y: { type: 'linear', includeZero: true },
        }}
      >
        <YAxis label="Price ($)" numTicks={4} />
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
          fill="#767676"
        />
        <XAxis label="Time" numTicks={5} />
      </ResponsiveXYChart>
    ),
  },
];
