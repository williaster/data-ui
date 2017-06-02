import React from 'react';
import { timeParse, timeFormat } from 'd3-time-format';

import {
  XYChart,

  XAxis,
  YAxis,

  BarSeries,
  IntervalSeries,
  LineSeries,
  GroupedBarSeries,
  StackedBarSeries,
  PointSeries,

  PatternLines,
  LinearGradient,
  withScreenSize,
  theme,
} from '@data-ui/xy-chart';

import {
  timeSeriesData,
  categoricalData,
  groupKeys,
  stackedData,
  groupedData,
  pointData,
  intervalLineData,
  intervalData,
} from './data';

const parseDate = timeParse('%Y%m%d');
const formatDate = timeFormat('%b %d');
const dateFormatter = date => formatDate(parseDate(date));

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

// @todo: factor these into separate stories to more fully demo each component
export default [
  {
    description: '<BarSeries /> with <PatternLines /> and <LinearGradient />',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
      >
        <LinearGradient
          id="gradient"
          from="#00A699"
          to="#84D2CB"
        />
        <PatternLines
          id="lines"
          height={5}
          width={5}
          stroke="#00A699"
          strokeWidth={1}
          orientation={['diagonal']}
        />
        <BarSeries
          data={timeSeriesData.map((d, i) => ({
            ...d, fill: `url(#${i === 2 ? 'lines' : 'gradient'})`,
          }))}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
      </ResponsiveXYChart>
    ),
  },
  {
    description: '<BarSeries /> + <LineSeries /> + <XAxis /> + <YAxis />',
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
        <BarSeries
          data={timeSeriesData}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <LineSeries
          data={timeSeriesData}
          label="Apple Stock"
          stroke="#484848"
        />
        <XAxis label="Time" numTicks={5} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'Inverted <XAxis /> + <YAxis />',
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
        <BarSeries
          data={timeSeriesData}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <XAxis label="Time" numTicks={5} orientation="top" />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'Multiple <LineSeries />',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
      >
        <YAxis label="Price ($)" numTicks={4} />
        <LineSeries
          data={timeSeriesData}
          label="Apple Stock"
          showPoints
        />
        <LineSeries
          data={timeSeriesData.map(d => ({ ...d, y: Math.random() > 0.5 ? d.y * 2 : d.y / 2 }))}
          label="Apple Stock 2"
          stroke="#484848"
          strokeDasharray="3 3"
        />
        <XAxis label="Time" numTicks={5} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: '<PointSeries />',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'linear', nice: true }}
        yScale={{ type: 'linear', nice: true }}
        showXGrid={false}
        showYGrid={false}
      >
        <YAxis label="Y" numTicks={4} />
        <XAxis label="X" numTicks={4} />
        <PointSeries
          data={pointData}
          label="Random"
          size={d => d.size}
        />
      </ResponsiveXYChart>
    ),
  },
  {
    description: '<StackedBarSeries />',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'band', paddingInner: 0.05 }}
        yScale={{ type: 'linear' }}
      >
        <YAxis label="Temperature (°F)" numTicks={4} />
        <StackedBarSeries
          data={stackedData}
          label="City Temperature"
          stackKeys={groupKeys}
        />
        <XAxis tickFormat={dateFormatter} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: '<GroupedBarSeries />',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'band', paddingInner: 0.15 }}
        yScale={{ type: 'linear' }}
        showYGrid={false}
      >
        <YAxis label="Temperature (°F)" numTicks={4} />
        <GroupedBarSeries
          data={groupedData}
          label="City Temperature"
          groupKeys={groupKeys}
        />
        <XAxis tickFormat={dateFormatter} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'Categorical <BarSeries />',
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
        <BarSeries
          data={categoricalData}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <XAxis numTicks={categoricalData.length} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: '<IntervalSeries />',
    example: () => (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear', domain: [40, 80] }}
      >
        <YAxis label="Temperature (°F)" numTicks={4} />
        <PatternLines
          id="interval_pattern"
          height={8}
          width={8}
          stroke="#84D2CB"
          strokeWidth={1}
          orientation={['diagonal']}
        />
        <IntervalSeries
          data={intervalData}
          label="Temperature interval"
          fill="url(#interval_pattern)"
        />
        <LineSeries
          data={intervalLineData}
          label="Line interval"
          showPoints
        />
        <XAxis />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'Non-zero y-axis',
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
        <BarSeries
          data={timeSeriesData}
          label="Apple Stock"
          fill="url(#aqua_lightaqua_gradient)"
        />
        <XAxis numTicks={0} />
      </ResponsiveXYChart>
    ),
  },
  {
    description: 'No theme',
    example: () => (
      <ResponsiveXYChart
        theme={{}}
        ariaLabel="Required label"
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
      >
        <YAxis label="Price ($)" numTicks={4} />
        <BarSeries
          data={timeSeriesData.filter((d, i) => i % 2 === 0)}
          label="Apple Stock"
          fill="#484848"
        />
        <BarSeries
          data={timeSeriesData.filter((d, i) => i % 2 !== 0 && i !== 5)}
          label="Apple Stock ii"
          fill="#767676"
        />
        <XAxis label="Time" numTicks={5} />
      </ResponsiveXYChart>
    ),
  },
];
