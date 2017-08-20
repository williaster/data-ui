/* eslint react/no-array-index-key: 0 */
import React from 'react';
import { range } from 'd3-array';

import {
  Sparkline,
  LineSeries,
  PointSeries,

  Label,
  BandLine,
  HorizontalReferenceLine,
  VerticalReferenceLine,

  PatternLines,
  LinearGradient,
} from '@data-ui/sparkline';

import { color, allColors } from '@data-ui/theme';

import Example from './Example';
import Spacer from '../shared/Spacer';

const sparklineProps = {
  ariaLabel: 'This is a Sparkline of...',
  width: 500,
  height: 100,
  margin: { top: 24, right: 80, bottom: 24, left: 8 },
};

const curvesData = [-10, 10, -10, 5, -5, 0];
const curves = ['cardinal', 'linear', 'monotoneX', 'basis'];

export default [
  {
    description: 'LineSeries',
    components: [
      Sparkline,
      LineSeries,
    ],
    example: () => (
      <Spacer top={2} left={2}>
        <Example title="Default with last point">
          <Sparkline
            {...sparklineProps}
            data={range(50).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <LineSeries />
            <PointSeries
              points={['last']}
              size={4}
              stroke="white"
              fill={color.default}
              renderLabel={d => d.toFixed(1)}
              labelPosition="right"
            />
          </Sparkline>
        </Example>

        <Example title="Filled with gradient">
          <Sparkline
            {...sparklineProps}
            data={range(40).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <LinearGradient
              id="area_gradient"
              to={allColors.pink[1]}
              from={allColors.pink[6]}
            />
            <LineSeries
              curve="basis"
              showArea
              fill="url(#area_gradient)"
              stroke={allColors.pink[4]}
            />
          </Sparkline>
        </Example>

        <Example title="Min, max, median, and inner quartiles">
          <Sparkline
            {...sparklineProps}
            data={range(30).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <PatternLines
              id="innerquartile_pattern"
              height={4}
              width={4}
              stroke={allColors.blue[5]}
              strokeWidth={1}
              orientation={['diagonal']}
            />
            <BandLine
              band="innerquartiles"
              fill="url(#innerquartile_pattern)"
            />
            <HorizontalReferenceLine
              stroke={allColors.blue[6]}
              strokeDasharray="3,3"
              strokeLinecap="square"
              strokeWidth={1}
              renderLabel={d => `Median ${d.toFixed(1)}`}
            />
            <LineSeries
              curve="linear"
              stroke={allColors.blue[4]}
            />
            <PointSeries
              points={['min', 'max']}
              fill={allColors.blue[6]}
              size={4}
              stroke="white"
              renderLabel={d => d.toFixed(1)}
            />
          </Sparkline>
        </Example>

        <Example title="All the curves">
          <Sparkline
            {...sparklineProps}
            data={curvesData}
          >
            {curvesData.map((_, i) => (
              <VerticalReferenceLine
                key={i}
                reference={i}
                stroke={color.grays[3]}
                strokeWidth={1}
                strokeLinecap="square"
                strokeDasharray="2,3"
                labelPosition="right"
              />
            ))}
            {curves.map((curve, i) => (
              <LineSeries
                key={curve}
                curve={curve}
                stroke={allColors.cyan[i + 2]}
                strokeWidth={2}
              />
            ))}
            {curves.map((curve, i) => (
              <Label
                key={curve}
                textAnchor="start"
                x={sparklineProps.width - sparklineProps.margin.right}
                dy={8 + (i * 12)}
                label={curve}
                fill={allColors.cyan[i + 2]}
                strokeWidth={1}
              />
            ))}
          </Sparkline>
        </Example>
      </Spacer>
    ),
  },
];
