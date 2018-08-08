import React from 'react';
import { timeParse, timeFormat } from 'd3-time-format';

import LegendOrdinal from '@vx/legend/build/legends/Ordinal';
import scaleOrdinal from '@vx/scale/build/scales/ordinal';

import { CrossHair, StackedAreaSeries, PatternCircles, theme, XAxis } from '@data-ui/xy-chart';

import { stackedData as initialStackedData, groupKeys as stackKeys } from './data';

import ResponsiveXYChart from './ResponsiveXYChart';
import WithToggle from '../shared/WithToggle';

const PATTERN_ID_1 = 'stackedarea_1';
const PATTERN_ID_2 = 'stackedarea_2';
const PATTERN_ID_3 = 'stackedarea_3';
const PATTERN_COLOR = theme.colors.categories[4];

export const parseDate = timeParse('%Y%m%d');
export const formatDate = timeFormat('%b %d');

const stackedData = initialStackedData.map(d => ({
  x: parseDate(d.x),
  ...stackKeys.reduce(
    (obj, key) => {
      // multple by a random fraction bc there isn't much variation in temp
      const value = d[key] * Math.max(0.1, Math.random());

      return { ...obj, y: obj.y + value, [key]: value };
    },
    { y: 0 },
  ),
}));

const percentStackedData = stackedData.map(d => ({
  ...d,
  y: 1,
  ...stackKeys.reduce((obj, key) => ({ ...obj, [key]: d[key] / d.y }), {}),
}));

const patternIds = [PATTERN_ID_1, PATTERN_ID_2, PATTERN_ID_3];
const stackFills = patternIds.map(id => `url(#${id})`);
const legendScale = scaleOrdinal({ range: stackFills, domain: stackKeys });

export default function StackedAreaExample() {
  return (
    <WithToggle id="lineseries_toggle" label="As percent" initialChecked>
      {asPercent => (
        <div>
          <div style={{ marginLeft: 24 }}>
            <LegendOrdinal
              key="legend"
              direction="row"
              scale={legendScale}
              shape={({ fill, width, height }) => (
                <svg width={width} height={height}>
                  <rect width={width} height={height} fill={fill} />
                </svg>
              )}
              fill={({ datum }) => legendScale(datum)}
              labelFormat={label => label}
            />
          </div>
          <ResponsiveXYChart
            ariaLabel="Stacked area chart of temperatures"
            key="chart"
            xScale={{ type: 'time' }}
            yScale={{ type: 'linear' }}
            margin={{ top: 8, left: 24, right: 24 }}
          >
            <PatternCircles
              id={PATTERN_ID_1}
              width={8}
              height={8}
              radius={2}
              stroke={PATTERN_COLOR}
              fill="#fff"
            />
            <PatternCircles
              id={PATTERN_ID_2}
              width={2}
              height={2}
              radius={2}
              stroke={PATTERN_COLOR}
              fill={PATTERN_COLOR}
            />
            <PatternCircles
              id={PATTERN_ID_3}
              width={4}
              height={4}
              radius={2}
              stroke={PATTERN_COLOR}
              fill="#fff"
            />
            <StackedAreaSeries
              data={asPercent ? percentStackedData : stackedData}
              strokeWidth={2}
              stackKeys={stackKeys}
              stackFills={stackFills}
              fillOpacity={1}
            />
            <CrossHair
              stroke={PATTERN_COLOR}
              strokeWidth={2}
              showHorizontalLine={false}
              showCircle={false}
              strokeDasharray=""
            />
            <CrossHair
              stroke="#fff"
              strokeWidth={1}
              showHorizontalLine={false}
              showCircle={false}
              strokeDasharray=""
            />
            <XAxis tickFormat={formatDate} />
          </ResponsiveXYChart>
        </div>
      )}
    </WithToggle>
  );
}
