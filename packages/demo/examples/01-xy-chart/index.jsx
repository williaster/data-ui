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
  theme,
} from '@data-ui/xy-chart';

import readme from '../../node_modules/@data-ui/xy-chart/README.md';

import CirclePackWithCallback from './CirclePackWithCallback';
import LinkedXYCharts from './LinkedXYCharts';
import RectPointComponent from './RectPointComponent';
import ResponsiveXYChart, { dateFormatter } from './ResponsiveXYChart';
import StackedAreaExample from './StackedAreaExample';
import ScatterWithHistogram from './ScatterWithHistograms';

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
  statsData,
} from './data';

import WithToggle from '../shared/WithToggle';

const { colors } = theme;
PatternLines.displayName = 'PatternLines';
LinearGradient.displayName = 'LinearGradient';

export default {
  usage: readme,
  examples: [
    {
      description: 'BarSeries -- no axes',
      components: [XYChart, BarSeries, LinearGradient, PatternLines],
      example: () => (
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
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
      ),
    },
    {
      description: 'LineSeries',
      components: [LineSeries, CrossHair],
      example: () => {
        const data2 = timeSeriesData.map(d => ({
          ...d,
          y: Math.random() > 0.5 ? d.y * 2 : d.y / 2,
        }));
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
                      >
                        <YAxis label="Price ($)" numTicks={4} />
                        <LineSeries
                          data={timeSeriesData}
                          showPoints
                          disableMouseEvents={disableMouseEvents}
                        />
                        <LineSeries
                          data={data2}
                          stroke={colors.categories[2]}
                          strokeDasharray="3 3"
                          strokeLinecap="butt"
                          disableMouseEvents={disableMouseEvents}
                        />
                        <CrossHair />
                        <XAxis label="Time" numTicks={5} />
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
      description: 'Box Plot Example',
      example: () => {
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
              label="Test"
              fill="url(#aqua_lightaqua_gradient)"
              stroke="#22b8cf"
              strokeWidth={1.5}
            />
            <XAxis />
          </ResponsiveXYChart>
        );
      },
    },
    {
      description: 'Single Horizontal Box Plot Example',
      example: () => {
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
            showYGrid
          >
            <LinearGradient
              id="aqua_lightaqua_gradient"
              from="#99e9f2"
              to="#c5f6fa"
            />
            <BoxPlotSeries
              data={boxPlotData}
              label="Test"
              fill="url(#aqua_lightaqua_gradient)"
              stroke="#22b8cf"
              strokeWidth={1.5}
              horizontal
            />
            <XAxis />
          </ResponsiveXYChart>
        );
      },
    },
    {
      description: 'Horizontal BoxPlot With ViolinPlot Example',
      example: () => {
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
              label="Test"
              fill="url(#vViolinLines)"
              stroke="#22b8cf"
              strokeWidth={0.5}
              horizontal
            />
            <BoxPlotSeries
              data={boxPlotData}
              label="Test"
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
      },
    },
    {
      description: 'BoxPlot With ViolinPlot Example',
      example: () => {
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
              label="Test"
              fill="url(#hViolinLines)"
              stroke="#22b8cf"
              strokeWidth={0.5}
            />
            <BoxPlotSeries
              data={boxPlotData}
              label="Test"
              fill={colors.categories[0]}
              stroke={colors.categories[0]}
              widthRatio={0.5}
              fillOpacity={0.2}
              strokeWidth={1}
            />
            <XAxis />
          </ResponsiveXYChart>
        );
      },
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
