import React from 'react';
import { range } from 'd3-array';

import {
  Sparkline,
  BarSeries,

  BandLine,
  HorizontalReferenceLine,
  VerticalReferenceLine,

  PatternLines,
  LinearGradient,
} from '@data-ui/sparkline';

import { color, allColors } from '@data-ui/theme';

import Spacer from '../shared/Spacer';
import Title from '../shared/Title';

const sparklineProps = {
  ariaLabel: 'This is a Sparkline of...',
  width: 500,
  height: 100,
  margin: { top: 24, right: 64, bottom: 24, left: 8 },
};

export default [
  {
    description: 'BarSeries',
    components: [
      Sparkline,
      BarSeries,
    ],
    example: () => (
      <Spacer top={3} left={3}>
        <Spacer left={1}>
          <Title>Default</Title>
          <Sparkline
            {...sparklineProps}
            data={range(50).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <BarSeries />
          </Sparkline>
        </Spacer>

        <Spacer left={1}>
          <Title>Custom fill and label with max line</Title>
          <Sparkline
            {...sparklineProps}
            data={range(25).map((_, i) => i + (Math.random() * 5))}
          >
            <HorizontalReferenceLine
              reference="max"
              stroke={allColors.grape[8]}
              strokeWidth={1}
              strokeDasharray="4,4"
              labelPosition="right"
              labelOffset={16}
              renderLabel={() => 'max'}
            />
            <BarSeries
              fill={(d, i) => allColors.grape[i === 24 ? 8 : 2]}
              fillOpacity={0.7}
              renderLabel={(d, i) => (i === 24 ? '🚀' : null)}
            />
          </Sparkline>
        </Spacer>

        <Spacer left={1}>
          <Title>Gradient fill</Title>
          <Sparkline
            {...sparklineProps}
            data={range(30).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <LinearGradient
              id="bar_gradient"
              to={allColors.yellow[1]}
              from={allColors.yellow[8]}
            />
            <BarSeries
              fill="url(#bar_gradient)"
              fillOpacity={(d, i) => (i === 24 ? 1 : 0.5)}
              renderLabel={(d, i) => (i === 24 ? d.toFixed(1) : null)}
            />
          </Sparkline>
        </Spacer>

        <Spacer left={1}>
          <Title>Pattern fill with vertical reference line</Title>
          <Sparkline
            {...sparklineProps}
            data={range(20).map(() => (
              5 * Math.random() * (Math.random() > 0.2 ? 1 : 2)
            ))}
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
            <VerticalReferenceLine
              reference={9.5}
              stroke={color.grays[8]}
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="square"
              renderLabel={() => 'Important point'}
            />
            <BarSeries
              fill={(d, i) => (i > 9 ? 'url(#bar_pattern_2)' : 'url(#bar_pattern)')}
            />
          </Sparkline>
        </Spacer>
      </Spacer>
    ),
  },
];
