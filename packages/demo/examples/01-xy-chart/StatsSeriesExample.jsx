/* eslint react/prop-types: 0 */
import React from 'react';

import {
  XAxis,
  YAxis,
  BoxPlotSeries,
  ViolinPlotSeries,
  PatternLines,
  LinearGradient,
  theme,
} from '@data-ui/xy-chart';

import ResponsiveXYChart from './ResponsiveXYChart';

import { statsData } from './data';

const { colors } = theme;

function renderViolinPlotTooltip({ datum, color }) {
  const { x, y, binData } = datum;
  const label = x || y;
  return (
    <div>
      <div>
        <strong style={{ color }}>{label}</strong>
      </div>
      <div>
        <strong style={{ color }}>Bin Number </strong>
        {binData.length}
      </div>
    </div>
  );
}
function renderBoxPlotTooltip({ datum, color }) {
  const {
    x,
    y,
    min,
    max,
    median,
    firstQuartile,
    thirdQuartile,
    outliers,
  } = datum;

  const label = x || y;
  return (
    <div>
      <div>
        <strong style={{ color }}>{label}</strong>
      </div>
      <div>
        <strong style={{ color }}>Min </strong>
        {min && min.toFixed ? min.toFixed(2) : min}
      </div>
      <div>
        <strong style={{ color }}>Max </strong>
        {max && max.toFixed ? max.toFixed(2) : max}
      </div>
      <div>
        <strong style={{ color }}>Median </strong>
        {median && median.toFixed ? median.toFixed(2) : median}
      </div>
      <div>
        <strong style={{ color }}>First Quartile </strong>
        {firstQuartile && firstQuartile.toFixed ? firstQuartile.toFixed(2) : firstQuartile}
      </div>
      <div>
        <strong style={{ color }}>Third Quartile </strong>
        {thirdQuartile && thirdQuartile.toFixed ? thirdQuartile.toFixed(2) : thirdQuartile}
      </div>
      <div>
        <strong style={{ color }}>Outliers Number </strong>
        {outliers.length}
      </div>
    </div>
  );
}

export function SimpleBoxPlotSeriesExample() {
  const boxPlotData = statsData.map(s => s.boxPlot);
  const values = boxPlotData.reduce((r, e) => r.push(e.min, e.max, ...e.outliers) && r, []);
  const minYValue = Math.min(...values);
  const maxYValue = Math.max(...values);
  const yDomain = [minYValue - (0.1 * Math.abs(minYValue)),
    maxYValue + (0.1 * Math.abs(minYValue))];
  return (
    <ResponsiveXYChart
      theme={{}}
      ariaLabel="Required label"
      xScale={{
        type: 'band',
        paddingInner: 0.15,
        paddingOuter: 0.3,
      }}
      yScale={{ type: 'linear',
        domain: yDomain,
      }}
      renderTooltip={renderBoxPlotTooltip}
      showYGrid
    >
      <LinearGradient
        id="aqua_lightaqua_gradient"
        from="#99e9f2"
        to="#c5f6fa"
      />
      <YAxis numTicks={4} />
      <BoxPlotSeries
        data={boxPlotData}
        fill="url(#aqua_lightaqua_gradient)"
        stroke="#22b8cf"
        strokeWidth={1.5}
      />
      <XAxis />
    </ResponsiveXYChart>
  );
}

export function SingleBoxPlotSeriesExample() {
  const singleStats = [statsData[0]];
  const boxPlotData = singleStats.map((s) => {
    const { boxPlot } = s;
    const { x, ...rest } = boxPlot;
    return {
      y: x,
      ...rest,
    };
  });
  const values = boxPlotData.reduce((r, e) => r.push(e.min, e.max, ...e.outliers) && r, []);
  const minXValue = Math.min(...values);
  const maxXValue = Math.max(...values);
  const xDomain = [minXValue - (0.1 * Math.abs(minXValue)),
    maxXValue + (0.1 * Math.abs(maxXValue))];
  return (
    <ResponsiveXYChart
      theme={{}}
      ariaLabel="Required label"
      yScale={{
        type: 'band',
        paddingInner: 0.15,
        paddingOuter: 0.3,
      }}
      xScale={{ type: 'linear',
        domain: xDomain,
      }}
      renderTooltip={renderBoxPlotTooltip}
      showYGrid
    >
      <LinearGradient
        id="aqua_lightaqua_gradient"
        from="#99e9f2"
        to="#c5f6fa"
      />
      <BoxPlotSeries
        data={boxPlotData}
        fill="url(#aqua_lightaqua_gradient)"
        stroke="#22b8cf"
        strokeWidth={1.5}
        horizontal
      />
      <XAxis />
    </ResponsiveXYChart>
  );
}

export function HorizontalBoxPlotViolinPlotSeriesExample() {
  const boxPlotData = statsData.map((s) => {
    const { boxPlot } = s;
    const { x, ...rest } = boxPlot;
    return {
      y: x,
      ...rest,
    };
  });
  const violinData = statsData.map(s => ({ y: s.boxPlot.x, binData: s.binData }));
  const values = boxPlotData.reduce((r, e) => r.push(e.min, e.max, ...e.outliers) && r, []);
  const minXValue = Math.min(...values);
  const maxXValue = Math.max(...values);
  const xDomain = [minXValue - (0.1 * Math.abs(minXValue)),
    maxXValue + (0.1 * Math.abs(maxXValue))];
  return (
    <ResponsiveXYChart
      theme={{}}
      ariaLabel="Required label"
      yScale={{
        type: 'band',
        paddingInner: 0.15,
        paddingOuter: 0.3,
      }}
      xScale={{ type: 'linear',
        domain: xDomain,
      }}
      renderTooltip={renderBoxPlotTooltip}
      showYGrid
    >
      <PatternLines
        id="vViolinLines"
        height={3}
        width={3}
        stroke="#ced4da"
        strokeWidth={1}
        fill="rgba(0,0,0,0.3)"
      />
      <YAxis numTicks={4} />
      <ViolinPlotSeries
        data={violinData}
        fill="url(#vViolinLines)"
        stroke="#22b8cf"
        strokeWidth={0.5}
        horizontal
        disableMouseEvents
      />
      <BoxPlotSeries
        data={boxPlotData}
        fill={colors.categories[0]}
        stroke={colors.categories[0]}
        widthRatio={0.5}
        fillOpacity={0.2}
        strokeWidth={1}
        horizontal
      />
      <XAxis />
    </ResponsiveXYChart>
  );
}

export function ViolinPlotSeriesExample() {
  const boxPlotData = statsData.map(s => s.boxPlot);
  const violinData = statsData.map(s => ({ x: s.boxPlot.x, binData: s.binData }));
  const values = boxPlotData.reduce((r, e) => r.push(e.min, e.max, ...e.outliers) && r, []);
  const minYValue = Math.min(...values);
  const maxYValue = Math.max(...values);
  const yDomain = [minYValue - (0.1 * Math.abs(minYValue)),
    maxYValue + (0.1 * Math.abs(minYValue))];
  return (
    <ResponsiveXYChart
      theme={{}}
      ariaLabel="Required label"
      xScale={{
        type: 'band',
        paddingInner: 0.15,
        paddingOuter: 0.3,
      }}
      yScale={{ type: 'linear',
        domain: yDomain,
      }}
      renderTooltip={renderViolinPlotTooltip}
      showYGrid
    >
      <PatternLines
        id="hViolinLines"
        height={3}
        width={3}
        stroke="#ced4da"
        strokeWidth={1}
        fill="rgba(0,0,0,0.3)"
        orientation={['horizontal']}
      />
      <YAxis numTicks={4} />
      <ViolinPlotSeries
        data={violinData}
        fill="url(#hViolinLines)"
        stroke="#22b8cf"
        strokeWidth={0.5}
      />
      <XAxis />
    </ResponsiveXYChart>
  );
}
