import React from 'react';

import mockData from '@vx/mock-data';
import {
  XYChart,
  LineSeries,
  VerticalBarSeries,
  XAxis,
  YAxis,
  withScreenSize,
} from '../../../xy-chart/build';

const ResponsiveXYChart = withScreenSize(({ screenWidth, children, ...rest }) => (
  <XYChart
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
  color: Math.random() > 0.75 ? 'category1' : 'category2',
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
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
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
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
        />
        <LineSeries
          data={data}
          label="Apple Stock"
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
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
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
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
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
        />
        <XAxis label="Time" numTicks={5} />
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
        <VerticalBarSeries
          data={data}
          label="Apple Stock"
        />
      </ResponsiveXYChart>
    ),
  },
];
