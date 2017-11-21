/* eslint react/prop-types: 0 */
import React from 'react';

import {
  XAxis,
  YAxis,
  BoxPlotSeries,
  ViolinPlotSeries,
  PatternCircles,
  PatternLines,
  LinearGradient,
  theme,
} from '@data-ui/xy-chart';

import ResponsiveXYChart from './ResponsiveXYChart';
import WithToggle from '../shared/WithToggle';

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
        <strong style={{ color }}>Bin count</strong>
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
      {min &&
        <div>
          <strong style={{ color }}>Min </strong>
          {min && min.toFixed ? min.toFixed(2) : min}
        </div>}
      {max &&
        <div>
          <strong style={{ color }}>Max </strong>
          {max && max.toFixed ? max.toFixed(2) : max}
        </div>}
      {median &&
        <div>
          <strong style={{ color }}>Median </strong>
          {median && median.toFixed ? median.toFixed(2) : median}
        </div>}
      {firstQuartile &&
        <div>
          <strong style={{ color }}>First quartile </strong>
          {firstQuartile && firstQuartile.toFixed ? firstQuartile.toFixed(2) : firstQuartile}
        </div>}
      {thirdQuartile &&
        <div>
          <strong style={{ color }}>Third quartile </strong>
          {thirdQuartile && thirdQuartile.toFixed ? thirdQuartile.toFixed(2) : thirdQuartile}
        </div>}
      {outliers && outliers.length > 0 &&
        <div>
          <strong style={{ color }}># Outliers </strong>
          {outliers.length}
        </div>}
    </div>
  );
}

function MouseEventTargetStyles({ containerEvents, color = colors.categories[7] }) {
  return (
    <style type="text/css">{`
      .vx-boxplot rect:not(:last-child),
      .vx-boxplot circle {
        stroke: ${containerEvents ? undefined : color};
        fill: ${color};
        fill-opacity: ${containerEvents ? 0 : 0.5};
      }

      .vx-boxplot .vx-boxplot-min,
      .vx-boxplot .vx-boxplot-median,
      .vx-boxplot .vx-boxplot-max {
        stroke: ${containerEvents ? undefined : color};
        stroke-width: ${containerEvents ? undefined : 3};
      }

      .vx-boxplot rect:last-child {
        fill: ${color};
        fill-opacity: ${containerEvents ? 0.5 : 0};
      }
    `}</style>
  );
}

export function SimpleBoxPlotSeriesExample() {
  const verticalBoxPlotData = statsData.map(s => s.boxPlot);
  const horizontalBoxPlotData = statsData.map((s) => {
    const { boxPlot } = s;
    const { x, ...rest } = boxPlot;
    return {
      y: x,
      ...rest,
    };
  });
  const values = verticalBoxPlotData.reduce((r, e) => r.push(e.min, e.max, ...e.outliers) && r, []);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueDomain = [
    minValue - (0.1 * Math.abs(minValue)),
    maxValue + (0.1 * Math.abs(minValue)),
  ];
  const bandScaleConfig = {
    type: 'band',
    paddingInner: 0.15,
    paddingOuter: 0.3,
  };
  const valueScaleConfig = {
    type: 'linear',
    domain: valueDomain,
  };

  return (
    <WithToggle id="toggle_boxplot_horizontal" label="Horizontal" initialChecked>
      {horizontal => (
        <WithToggle id="toggle_boxplot_container_e" label="Container mouse events" initialChecked>
          {containerEvents => (
            <WithToggle id="toggle_boxplot_show_container" label="Show mouse targets">
              {showTargets => ([
                showTargets && <MouseEventTargetStyles containerEvents={containerEvents} />,
                <ResponsiveXYChart
                  ariaLabel="Boxplot example"
                  xScale={horizontal ? valueScaleConfig : bandScaleConfig}
                  yScale={horizontal ? bandScaleConfig : valueScaleConfig}
                  renderTooltip={renderBoxPlotTooltip}
                  margin={{ right: 80, left: 16, top: 16 }}
                  showYGrid
                >
                  <LinearGradient
                    id="simple_box_plot_series_gradient"
                    from="rgb(77,173,247)"
                    to="rgba(77,173,247,0.4)"
                  />
                  <YAxis numTicks={4} />
                  <PatternLines
                    id="boxplot_lines"
                    height={4}
                    width={4}
                    stroke={colors.categories[4]}
                    strokeWidth={1}
                    orientation={['diagonal']}
                  />
                  <BoxPlotSeries
                    data={horizontal ? horizontalBoxPlotData : verticalBoxPlotData}
                    fill="url(#boxplot_lines)"
                    stroke={colors.categories[3]}
                    strokeWidth={2}
                    horizontal={horizontal}
                    containerEvents={containerEvents}
                  />
                  <XAxis numTicks={4} />
                </ResponsiveXYChart>,
              ])}
            </WithToggle>
          )}
        </WithToggle>
      )}
    </WithToggle>
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
  const xDomain = [
    minXValue - (0.1 * Math.abs(minXValue)),
    maxXValue + (0.1 * Math.abs(maxXValue)),
  ];
  return (
    <WithToggle id="boxplot_violin_box_toggle" label="Show boxplot" initialChecked>
      {showBoxplot => (
        <WithToggle id="boxplot_violin_violin_toggle" label="Show violin" initialChecked>
          {showViolin => (
            <ResponsiveXYChart
              ariaLabel="Horizontal box plot + violin"
              yScale={{
                type: 'band',
                paddingInner: 0.15,
                paddingOuter: 0.3,
              }}
              xScale={{
                type: 'linear',
                domain: xDomain,
              }}
              margin={{ right: 70, left: 16 }}
              renderTooltip={renderBoxPlotTooltip}
              showYGrid
            >
              <PatternLines
                id="horiz_box_violin_lines"
                height={4}
                width={4}
                stroke="#fff"
                strokeWidth={1}
                background="rgba(0,0,100,0.2)"
                orientation={['diagonal']}
              />
              <YAxis numTicks={4} />
              {showViolin &&
                <ViolinPlotSeries
                  data={violinData}
                  fill="url(#horiz_box_violin_lines)"
                  stroke="#22b8cf"
                  strokeWidth={1}
                  horizontal
                  disableMouseEvents
                />}
              {showBoxplot &&
                <BoxPlotSeries
                  data={boxPlotData}
                  fill={colors.categories[7]}
                  stroke={colors.categories[7]}
                  widthRatio={0.5}
                  fillOpacity={0.2}
                  strokeWidth={1}
                  horizontal
                  containerEvents={false}
                />}
              <XAxis />
            </ResponsiveXYChart>
          )}
        </WithToggle>
      )}
    </WithToggle>
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
      ariaLabel="Violin plot"
      xScale={{
        type: 'band',
        paddingInner: 0.15,
        paddingOuter: 0.3,
      }}
      yScale={{
        type: 'linear',
        domain: yDomain,
      }}
      renderTooltip={renderViolinPlotTooltip}
      showYGrid
    >
      <PatternCircles
        id="violin_plot_circles"
        height={3}
        width={3}
        radius={2}
        stroke={colors.categories[3]}
        fill="#fff"
      />
      <YAxis numTicks={4} />
      <ViolinPlotSeries
        data={violinData}
        fill="url(#violin_plot_circles)"
        stroke={colors.categories[3]}
        strokeWidth={1}
      />
      <XAxis />
    </ResponsiveXYChart>
  );
}
