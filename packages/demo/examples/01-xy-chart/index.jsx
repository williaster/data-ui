import React from 'react';

import {
  XYChart,
  CrossHair,

  XAxis,
  YAxis,

  AreaSeries,
  BarSeries,
  CirclePackSeries,
  GroupedBarSeries,
  IntervalSeries,
  LineSeries,
  PointSeries,
  StackedBarSeries,
  BoxPlotSeries,
  ViolinPlotSeries,

  HorizontalReferenceLine,
  PatternLines,
  LinearGradient,
  WithTooltip,
} from '@data-ui/xy-chart';

import colors from '@data-ui/theme/build/color';
import readme from '../../node_modules/@data-ui/xy-chart/README.md';

import CirclePackWithCallback from './CirclePackWithCallback';
import LineSeriesExample from './LineSeriesExample';
import LinkedXYCharts from './LinkedXYCharts';
import RectPointComponent from './RectPointComponent';
import ResponsiveXYChart, { dateFormatter } from './ResponsiveXYChart';
import StackedAreaExample from './StackedAreaExample';
import ScatterWithHistogram from './ScatterWithHistograms';
import {
  BoxPlotSeriesExample,
  BoxPlotViolinPlotSeriesExample,
} from './StatsSeriesExample';

import {
  circlePackData,
  timeSeriesData,
  categoricalData,
  groupKeys,
  stackedData,
  groupedData,
  pointData,
  intervalLineData,
  intervalData,
  temperatureBands,
  priceBandData,
} from './data';

import WithToggle from '../shared/WithToggle';

PatternLines.displayName = 'PatternLines';
LinearGradient.displayName = 'LinearGradient';

export default {
  usage: readme,
  examples: [
    {
      description: 'BarSeries -- no axes',
      components: [XYChart, BarSeries, LinearGradient, PatternLines],
      example: () => (
        <WithTooltip
          renderTooltip={({ datum }) => datum.y}
          tooltipProps={{
            offsetTop: 0,
            style: {
              backgroundColor: 'pink',
              opacity: 0.9,
            },
          }}
        >
          <ResponsiveXYChart
            ariaLabel="Required label"
            xScale={{ type: 'time' }}
            yScale={{ type: 'linear' }}
            renderTooltip={null}
          >
            <LinearGradient
              id="gradient"
              from={colors.default}
              to={colors.dark}
            />
            <PatternLines
              id="lines"
              height={8}
              width={8}
              stroke={colors.categories[2]}
              strokeWidth={1}
              orientation={['horizontal', 'vertical']}
            />
            <BarSeries
              data={timeSeriesData.map((d, i) => ({
                ...d,
                fill: `url(#${i === 2 ? 'lines' : 'gradient'})`,
              }))}
              fill="url(#aqua_lightaqua_gradient)"
            />
          </ResponsiveXYChart>
        </WithTooltip>
      ),
    },
    {
      description: 'LineSeries',
      components: [LineSeries, CrossHair],
      example: () => <LineSeriesExample />,
    },
    {
      description: 'AreaSeries -- closed',
      components: [AreaSeries],
      example: () => (
        <WithToggle id="area_snap_data_x" label="Snap tooltip to x" initialChecked>
          {snapToDataX => (
            <WithToggle id="area_snap_data_y" label="Snap tooltip to y">
              {snapToDataY => (
                <ResponsiveXYChart
                  eventTrigger="container"
                  ariaLabel="Required label"
                  xScale={{ type: 'time' }}
                  yScale={{ type: 'linear' }}
                  margin={{ left: 8, top: 8, bottom: 64 }}
                  snapTooltipToDataX={snapToDataX}
                  snapTooltipToDataY={snapToDataY}
                >
                  <LinearGradient
                    id="area_gradient"
                    from={colors.categories[2]}
                    to="#fff"
                  />
                  <PatternLines
                    id="area_pattern"
                    height={12}
                    width={12}
                    stroke={colors.categories[2]}
                    strokeWidth={1}
                    orientation={['diagonal']}
                  />
                  <AreaSeries
                    seriesKey="one"
                    data={timeSeriesData}
                    fill="url(#area_gradient)"
                    strokeWidth={null}
                  />
                  <AreaSeries
                    seriesKey="two"
                    data={timeSeriesData}
                    fill="url(#area_pattern)"
                    stroke={colors.categories[2]}
                  />
                  <CrossHair
                    showHorizontalLine={false}
                    fullHeight
                    stroke={colors.darkGray}
                    circleFill={colors.categories[2]}
                    circleStroke="white"
                  />
                  <XAxis label="Time" numTicks={5} />
                </ResponsiveXYChart>
              )}
            </WithToggle>
          )}
        </WithToggle>
      ),
    },
    {
      description: 'AreaSeries -- band',
      components: [XYChart, AreaSeries, LineSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
          eventTrigger="container"
          renderTooltip={({ datum, series }) => (
            <div>
              <div>
                <strong>{dateFormatter(datum.x)}</strong>
                {(!series || Object.keys(series).length === 0) &&
                  <div>
                    {datum.y.toFixed(2)}
                  </div>}
              </div>
              <br />
              {temperatureBands.map((_, i) => {
                const key = `band-${i}`;
                return (
                  series && series[key] &&
                    <div key={key}>
                      <span
                        style={{
                          color: colors.categories[i + 1],
                          textDecoration: series[key] === datum
                            ? `underline solid ${colors.categories[i + 1]}` : null,
                          fontWeight: series[key] === datum ? 600 : 200,
                        }}
                      >
                        {`${key} `}
                      </span>
                      {series[key].y.toFixed(2)}
                    </div>
                );
              })}
            </div>
          )}
        >
          {temperatureBands.map((data, i) => ([
            <PatternLines
              id={`band-${i}`}
              height={5}
              width={5}
              stroke={colors.categories[i + 1]}
              strokeWidth={1}
              orientation={['diagonal']}
            />,
            <AreaSeries
              seriesKey={`band-${i}`}
              key={`band-${data[0].key}`}
              data={data}
              strokeWidth={0.5}
              stroke={colors.categories[i + 1]}
              fill={`url(#band-${i})`}
            />,
            <LineSeries
              seriesKey={`line-${data[0].key}`}
              data={data}
              stroke={colors.categories[i + 1]}
              disableMouseEvents
            />,
          ]))}
          <YAxis label="Temperature (°F)" numTicks={4} />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.darkGray}
            circleStroke={colors.darkGray}
            circleFill="white"
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'AreaSeries -- confidence intervals',
      components: [XYChart, AreaSeries, LineSeries, PointSeries],
      example: (reference = 150) => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
          eventTrigger="container"
        >
          <XAxis numTicks={5} />
          <YAxis label="Price" tickFormat={val => `$${val}`} />
          <LinearGradient
            id="confidence-interval-fill"
            from={colors.categories[3]}
            to={colors.categories[4]}
          />
          <HorizontalReferenceLine
            reference={reference}
            label={`Min $${reference}`}
            strokeDasharray="3 3"
            strokeLinecap="butt"
          />
          <AreaSeries
            data={priceBandData.band}
            fill="url(#confidence-interval-fill)"
            strokeWidth={0}
            disableMouseEvents
          />
          <LineSeries
            data={priceBandData.points.map(d => (d.y >= reference ? d : { ...d, y: reference }))}
            stroke={colors.categories[3]}
            strokeWidth={2}
          />
          <PointSeries
            data={priceBandData.points.filter(d => d.y < reference)}
            fill="#fff"
            fillOpacity={1}
            stroke={colors.categories[3]}
          />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.categories[3]}
            circleStroke="white"
            circleFill="white"
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'PointSeries with Histogram',
      components: [PointSeries],
      example: () => (
        <ScatterWithHistogram />
      ),
    },
    {
      description: 'Linked charts',
      components: [XYChart, StackedBarSeries, AreaSeries, CrossHair],
      example: () => (
        <LinkedXYCharts />
      ),
    },
    {
      description: 'StackedAreaSeries',
      components: [XYChart],
      example: () => (
        <StackedAreaExample />
      ),
    },
    {
      description: 'PointSeries',
      components: [PointSeries],
      example: () => (
        <WithToggle id="pointseries_toggle" label="Show voronoi" initialChecked>
          {showVoronoi => (
            <ResponsiveXYChart
              ariaLabel="Required label"
              xScale={{ type: 'linear', nice: true }}
              yScale={{ type: 'linear', nice: true }}
              showXGrid={false}
              showYGrid={false}
              eventTrigger="voronoi"
              showVoronoi={showVoronoi}
            >
              <YAxis label="Y" numTicks={4} />
              <XAxis label="X" numTicks={4} />
              <PointSeries
                data={pointData}
                size={d => d.size}
              />
              <CrossHair fullWidth fullHeight showCircle={false} />
            </ResponsiveXYChart>
          )}
        </WithToggle>
      ),
    },
    {
      description: 'PointSeries With Customized Renderer',
      components: [PointSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'linear', nice: true }}
          yScale={{ type: 'linear', nice: true }}
          eventTrigger="voronoi"
        >
          <YAxis label="Y" numTicks={4} />
          <XAxis label="X" numTicks={4} />
          <PointSeries
            data={pointData}
            size={d => d.size}
            pointComponent={RectPointComponent}
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'StackedBarSeries',
      components: [StackedBarSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'band', paddingInner: 0.05 }}
          yScale={{ type: 'linear' }}
        >
          <YAxis label="Temperature (°F)" numTicks={4} />
          <StackedBarSeries
            data={stackedData}
            stackKeys={groupKeys}
          />
          <XAxis tickFormat={dateFormatter} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'GroupedBarSeries',
      components: [GroupedBarSeries],
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
            groupKeys={groupKeys}
          />
          <XAxis tickFormat={dateFormatter} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'Categorical BarSeries With Snapping Tooltip',
      components: [XYChart, BarSeries, CrossHair],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'band' }}
          yScale={{ type: 'linear' }}
          eventTrigger="container"
          snapTooltipToDataX
          snapTooltipToDataY
        >
          <LinearGradient
            id="aqua_lightaqua_gradient"
            from={colors.default}
            to={colors.dark}
          />
          <BarSeries
            data={categoricalData}
            fill="url(#aqua_lightaqua_gradient)"
          />
          <XAxis numTicks={categoricalData.length} />
          <CrossHair
            stroke={colors.dark}
            circleFill={colors.dark}
            showVerticalLine={false}
            fullWidth
          />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'IntervalSeries',
      components: [IntervalSeries, LineSeries, CrossHair],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear', domain: [40, 80] }}
          eventTrigger="container"
        >
          <YAxis label="Temperature (°F)" numTicks={4} />
          <PatternLines
            id="interval_pattern"
            height={8}
            width={8}
            stroke={colors.dark}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <LineSeries
            data={intervalLineData}
            showPoints
          />
          <IntervalSeries
            data={intervalData}
            fill="url(#interval_pattern)"
          />
          <XAxis numTicks={0} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'CirclePackSeries',
      components: [CirclePackSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <CirclePackSeries
            data={circlePackData}
            size={d => d.r}
          />
          <HorizontalReferenceLine
            reference={0}
          />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.darkGray}
            circleFill="white"
            circleStroke={colors.darkGray}
          />
          <XAxis label="Time" numTicks={5} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'CirclePackSeries with custom renderer and height callback',
      components: [CirclePackSeries],
      example: () => <CirclePackWithCallback />,
    },
    {
      description: 'Box Plot Example',
      components: [BoxPlotSeries],
      example: () => (
        <BoxPlotSeriesExample />
      ),
    },
    {
      description: 'Horizontal BoxPlot With ViolinPlot Example',
      components: [BoxPlotSeries, ViolinPlotSeries],
      example: () => (
        <BoxPlotViolinPlotSeriesExample />
      ),
    },
    {
      description: 'Mixed series',
      components: [BarSeries, LineSeries, XAxis, YAxis, CrossHair],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <YAxis label="Price ($)" numTicks={4} />
          <LinearGradient
            id="aqua_lightaqua_gradient"
            to="#faa2c1"
            from="#e64980"
          />
          <BarSeries
            data={timeSeriesData}
            fill="url(#aqua_lightaqua_gradient)"
          />
          <LineSeries
            data={timeSeriesData}
            stroke={colors.text}
          />
          <XAxis label="Time" numTicks={5} />
          <CrossHair />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'XAxis, YAxis -- orientation',
      components: [XAxis, YAxis],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <YAxis label="Price ($)" numTicks={4} orientation="left" />
          <LinearGradient
            id="aqua_lightaqua_gradient"
            from={colors.default}
            to={colors.dark}
          />
          <BarSeries
            data={timeSeriesData}
            fill="url(#aqua_lightaqua_gradient)"
          />
          <XAxis label="Time" numTicks={5} orientation="top" />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'Non-zero y-axis',
      components: [YAxis],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear', includeZero: false }}
        >
          <YAxis label="$$$" numTicks={4} />
          <LinearGradient
            id="aqua_lightaqua_gradient"
            from={colors.default}
            to={colors.dark}
          />
          <BarSeries
            data={timeSeriesData}
            fill="url(#aqua_lightaqua_gradient)"
          />
          <XAxis numTicks={0} />
        </ResponsiveXYChart>
      ),
    },
    {
      description: 'No theme',
      components: [XYChart, CrossHair],
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
            fill="#484848"
          />
          <BarSeries
            data={timeSeriesData.filter((d, i) => i % 2 !== 0 && i !== 5)}
            fill="#767676"
          />
          <XAxis label="Time" numTicks={5} />
          <CrossHair />
        </ResponsiveXYChart>
      ),
    },
  ],
};
