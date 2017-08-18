import React from 'react';
import { range } from 'd3-array';

import {
  Sparkline,
  LineSeries,

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
    description: 'LineSeries',
    components: [
      Sparkline,
      LineSeries,
    ],
    example: () => (
      <Spacer top={3} left={3}>
        <Spacer left={1}>
          <Title>Default</Title>
          <Sparkline
            {...sparklineProps}
            data={range(50).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <LineSeries />
          </Sparkline>
        </Spacer>
      </Spacer>
    ),
  },
];
