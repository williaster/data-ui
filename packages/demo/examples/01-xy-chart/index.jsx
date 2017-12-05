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

import colors, { allColors } from '@data-ui/theme/build/color';
import readme from '../../node_modules/@data-ui/xy-chart/README.md';

import CirclePackWithCallback from './CirclePackWithCallback';
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
      example: () => {
        const seriesProps = [
          {
            label: 'Series 1',
            key: 'Series 1',
            data: timeSeriesData,
            stroke: allColors.grape[5],
            showPoints: true,
          },
          {
            label: 'Series 2',
            key: 'Series 2',
            data: timeSeriesData.map(d => ({
              ...d,
              y: Math.random() > 0.5 ? d.y * 2 : d.y / 2,
            })),
            stroke: allColors.orange[5],
            strokeDasharray: '6 4',
            strokeLinecap: 'butt',
          },
          {
            label: 'Series 3',
            key: 'Series 3',
            data: timeSeriesData.map(d => ({
              ...d,
              y: Math.random() < 0.3 ? d.y * 3 : d.y / 3,
            })),
            stroke: allColors.pink[5],
            strokeDasharray: '2 2',
            strokeLinecap: 'butt',
          },
        ];
        return (
          <WithToggle id="line_use_voronoi_toggle" label="Use voronoi" initialChecked>
            {useVoronoi => (
              <WithToggle id="line_show_voronoi_toggle" label="Show voronoi" initialChecked>
                {showVoronoi => (
                  <WithToggle id="line_m_events_toggle" label="Disable mouse events">
                    {disableMouseEvents => (
                      <ResponsiveXYChart
                        ariaLabel="Required label"
                        xScale={{ type: 'time' }}
                        yScale={{ type: 'linear' }}
                        useVoronoi={useVoronoi}
                        showVoronoi={showVoronoi}
                        renderTooltip={({ datum, series }) => (
                          <div>
                            <div>
                              {dateFormatter(datum.x)}
                            </div>
                            <br />
                            {seriesProps.map(({ label, stroke: color }) => (
                              series && series[label] &&
                                <div key={label}>
                                  <span
                                    style={{
                                      color,
                                      textDecoration: series[label] === datum
                                        ? `underline ${color}` : null,
                                    }}
                                  >
                                    {`${label} `}
                                  </span>
                                  {series[label].y.toFixed(2)}
                                </div>
                            ))}
                            {(!series || Object.keys(series).length === 0) &&
                              <div>
                                <strong>y </strong>
                                {datum.y.toFixed(2)}
                              </div>}
                          </div>
                        )}
                      >
                        {seriesProps.map(props => (
                          <LineSeries
                            {...props}
                            disableMouseEvents={disableMouseEvents}
                          />
                        ))}
                        <CrossHair
                          fullHeight
                          showHorizontalLine={false}
                          strokeDasharray=""
                          stroke={colors.grays[7]}
                          circleStroke={colors.grays[7]}
                          circleFill="#fff"
                        />
                        <XAxis label="Time" numTicks={5} />
                        <YAxis label="Price ($)" numTicks={4} />
                      </ResponsiveXYChart>
                    )}
                  </WithToggle>
                )}
              </WithToggle>
            )}
          </WithToggle>
        );
      },
    },
    {
      description: 'AreaSeries -- closed',
      components: [AreaSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
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
            data={timeSeriesData}
            fill="url(#area_gradient)"
            strokeWidth={null}
          />
          <AreaSeries
            data={timeSeriesData}
            fill="url(#area_pattern)"
            stroke={colors.categories[2]}
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
      description: 'AreaSeries -- band',
      components: [XYChart, AreaSeries, LineSeries],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
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
              key={`band-${data[0].key}`}
              data={data}
              strokeWidth={0.5}
              stroke={colors.categories[i + 1]}
              fill={`url(#band-${i})`}
            />,
            <LineSeries
              key={`line-${data[0].key}`}
              data={data}
              stroke={colors.categories[i + 1]}
            />,
          ]))}
          <YAxis label="Temperature (°F)" numTicks={4} />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.gray}
            circleStroke={colors.gray}
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
          useVoronoi
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
            circleStroke={colors.categories[3]}
            circleFill="transparent"
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
              useVoronoi
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
      description: 'Categorical BarSeries',
      components: [XYChart, BarSeries, CrossHair],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'band' }}
          yScale={{ type: 'linear' }}
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
