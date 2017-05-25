import React from 'react';

import mockData from '@vx/mock-data';
import { timeParse, timeFormat } from 'd3-time-format';

import {
  XYChart,
  LineSeries,
  VerticalBarSeries,
  XAxis,
  YAxis,
  LinearGradient,
  withScreenSize,
  theme,
} from '../../../xy-chart/build';


const parseDate = timeParse('%Y%m%d');
const formatDate = timeFormat('%b %d');
const dateFormatter = date => formatDate(parseDate(date));

const ResponsiveXYChart = withScreenSize(({ screenWidth, children, ...rest }) => (
  <XYChart
    theme={theme}
    width={screenWidth / 1.1}
    height={screenWidth / 1.1 / 2}
    {...rest}
  >
    {children}
  </XYChart>
));

const { cityTemperature, appleStock } = mockData;

const data = appleStock.filter((d, i) => i % 120 === 0).map(d => ({
  x: new Date(d.date),
  y: d.close,
}));

const stackKeys = Object.keys(cityTemperature[0]).filter(attr => attr !== 'date');
const stackedData = cityTemperature.slice(0, 12).map(d => ({
  ...d,
  x: d.date,
  y: stackKeys.reduce((ret, curr) => ret + Number(d[curr]), 0),
}));

export default [
  {
    description: 'time bar chart',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
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
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
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
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
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
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
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
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
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
        xScale={{ type: 'band' }}
        yScale={{ type: 'linear' }}
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
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear', includeZero: false }}
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
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
      >
        <YAxis label="Price ($)" numTicks={4} />
        <VerticalBarSeries
          data={data.filter((d, i) => i % 2 === 0)}
          label="Apple Stock"
          fill="#484848"
        />
        <VerticalBarSeries
          data={data.filter((d, i) => i % 2 !== 0 && i !== 5)}
          label="Apple Stock ii"
          fill="#767676"
        />
        <XAxis label="Time" numTicks={5} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'vertical stack',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'band', paddingInner: 0.05 }}
        yScale={{ type: 'linear' }}
      >
        <YAxis label="Price ($)" numTicks={4} />
        <VerticalBarSeries
          data={stackedData}
          label="Apple Stock"
          stack={stackKeys}
        />
        <XAxis label="Time" numTicks={5} tickFormat={dateFormatter} />
      </ResponsiveXYChart>
    ),
  },
];
