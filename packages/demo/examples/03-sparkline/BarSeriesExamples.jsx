import React from 'react';
import { range } from 'd3-array';

import {
  Sparkline,
  BarSeries,
  LineSeries,

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
  margin: { top: 24, right: 64, bottom: 24, left: 8 },
};

const randomData = n => range(n).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)));

export default [
  {
    description: 'BarSeries',
    components: [
      Sparkline,
      BarSeries,
    ],
    example: () => (
      <Spacer top={2} left={2}>
        <Example title="Default">
          <Sparkline
            {...sparklineProps}
            data={randomData(50)}
          >
            <BarSeries />
          </Sparkline>
        </Example>

        <Example title="Custom fill with label and max line">
          <Sparkline
            {...sparklineProps}
            data={range(35).map((_, i) => i + (5 * Math.random()) + (i === 34 ? 5 : 0))}
          >
            <HorizontalReferenceLine
              reference="max"
              stroke={allColors.grape[8]}
              strokeWidth={1}
              strokeDasharray="3,3"
              labelPosition="right"
              labelOffset={12}
              renderLabel={() => 'max'}
            />
            <BarSeries
              fill={(d, i) => allColors.grape[i === 34 ? 8 : 2]}
              fillOpacity={0.7}
              renderLabel={(d, i) => (i === 34 ? '🚀' : null)}
            />
          </Sparkline>
        </Example>

        <Example title="Gradient fill with vertical reference line">
          <Sparkline
            {...sparklineProps}
            data={randomData(30)}
          >
            <LinearGradient
              id="bar_gradient"
              to={allColors.yellow[1]}
              from={allColors.yellow[8]}
            />
            <VerticalReferenceLine
              reference={24}
              stroke={allColors.yellow[8]}
              strokeWidth={1}
              strokeDasharray="3,3"
              renderLabel={d => d.toFixed(1)}
            />
            <BarSeries
              fill="url(#bar_gradient)"
              fillOpacity={(d, i) => (i === 24 ? 1 : 0.5)}
            />
          </Sparkline>
        </Example>

        <Example title="With a line">
          <Sparkline
            {...sparklineProps}
            data={randomData(30)}
          >
            <BarSeries fillOpacity={0.9} fill={allColors.teal[3]} />
            <LineSeries stroke={allColors.teal[8]} />
          </Sparkline>
        </Example>

        <Example title="Pattern fill with vertical reference line">
          <Sparkline
            {...sparklineProps}
            data={randomData(20)}
          >
            <PatternLines
              id="bar_pattern"
              height={4}
              width={4}
              stroke={color.grays[6]}
              strokeWidth={1}
              orientation={['diagonal']}
            />
            <PatternLines
              id="bar_pattern_2"
              height={4}
              width={4}
              stroke={allColors.pink[7]}
              strokeWidth={1}
              orientation={['horizontal', 'vertical']}
            />
            <BarSeries
              fill={(d, i) => (i > 9 ? 'url(#bar_pattern_2)' : 'url(#bar_pattern)')}
              strokeWidth={5}
            />
            <VerticalReferenceLine
              reference={9.5}
              stroke={color.grays[8]}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="square"
              renderLabel={() => <tspan fill={allColors.pink[7]}>!!!</tspan>}
            />
          </Sparkline>
        </Example>

      </Spacer>
    ),
  },
];
