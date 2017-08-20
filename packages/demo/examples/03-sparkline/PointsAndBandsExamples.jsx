/* eslint react/no-array-index-key: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import { range } from 'd3-array';

import {
  Sparkline,
  LineSeries,
  PointSeries,

  BandLine,
  HorizontalReferenceLine,
  VerticalReferenceLine,

  PatternLines,
} from '@data-ui/sparkline';

import { allColors } from '@data-ui/theme';

import Spacer from '../shared/Spacer';
import Title from '../shared/Title';

const sparklineProps = {
  ariaLabel: 'This is a Sparkline of...',
  width: 500,
  height: 100,
  margin: { top: 24, right: 72, bottom: 24, left: 8 },
};

function Example({ title, children }) {
  return (
    <Spacer left={1}>
      <Title>{title}</Title>
      {typeof children === 'function' ? children() : children}
    </Spacer>
  );
}

Example.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default [
  {
    description: 'Miscellaneous❗️',
    components: [
      Sparkline,
      LineSeries,
    ],
    example: () => (
      <Spacer top={2} left={2}>
        <Example title="All points">
          {() => {
            const data = range(40).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)));
            return (
              <Sparkline
                {...sparklineProps}
                data={data}
              >
                <LineSeries
                  strokeWidth={1}
                  stroke={allColors.cyan[3]}
                />
                <PointSeries points={['all']} />
                <PointSeries points={['max']} fill={allColors.yellow[6]} />
              </Sparkline>
            );
          }}
        </Example>

        <Example title="Nonsense bands">
          <Sparkline
            {...sparklineProps}
            data={[10, -10, 5, -5, 1, -1, 0]}
          >
            <PatternLines
              id="band_pattern"
              height={4}
              width={4}
              stroke={allColors.grape[4]}
              strokeWidth={1}
              orientation={['diagonal']}
            />
            <BandLine
              band={{ from: { y: 1 }, to: { y: 10 } }}
              fill="url(#band_pattern)"
            />
            <BandLine
              band={{ from: { x: 1 }, to: { x: 3 } }}
              fill="url(#band_pattern)"
            />
            <LineSeries
              strokeWidth={2}
              stroke={allColors.grape[6]}
            />
            <PointSeries points={['all']} fill={allColors.grape[4]} />
          </Sparkline>
        </Example>

        <Example title="Vertical lines for every point">
          {() => {
            const data = range(30).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)));
            return (
              <Sparkline
                {...sparklineProps}
                data={data}
              >
                {data.map((_, i) => (
                  <VerticalReferenceLine
                    key={i}
                    reference={i}
                    stroke={allColors.green[3]}
                    strokeWidth={1}
                    strokeLinecap="square"
                    strokeDasharray="2,2"
                  />
                ))}
                <LineSeries stroke={allColors.green[6]} />
                <PointSeries points={['all']} fill={allColors.green[3]} />
              </Sparkline>
            );
          }}
        </Example>

        <Example title="Same scales for comparison">
          <Spacer>
            {[9, 6, 3].map(multiplier => (
              <Sparkline
                key={multiplier}
                {...sparklineProps}
                height={50}
                margin={{ ...sparklineProps.margin, top: 8, bottom: 4 }}
                data={range(25).map(() => multiplier * Math.random())}
                min={0}
                max={10}
              >
                <BandLine
                  fill={allColors.orange[1]}
                  band={{ from: {}, to: {} }}
                />
                <HorizontalReferenceLine
                  reference={10}
                  stroke={allColors.orange[7]}
                  strokeDasharray="3,3"
                  strokeLinecap="square"
                  strokeWidth={1}
                  renderLabel={d => <tspan fill={allColors.orange[7]}>{d.toFixed(1)}</tspan>}
                />
                <LineSeries
                  curve="cardinal"
                  strokeWidth={2}
                  stroke={allColors.orange[6]}
                />
                <PointSeries
                  points={['min', 'max']}
                  fill={allColors.orange[6]}
                />
              </Sparkline>
            ))}
          </Spacer>
        </Example>
      </Spacer>
    ),
  },
];
