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
  LinearGradient,
} from '@data-ui/sparkline';

import { color, allColors } from '@data-ui/theme';

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
          {() => {
            const data = [-10, 10, -10, 5, -5, 0];
            const curves = [
              { curve: 'cardinal', stroke: allColors.yellow },
              { curve: 'linear', stroke: allColors.pink },
              { curve: 'monotoneX', stroke: allColors.orange },
              { curve: 'basis', stroke: allColors.red },
            ];

            return (
              <Sparkline
                {...sparklineProps}
                data={data}
              >
                {data.map((_, i) => (
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
                {curves.map(({ curve, stroke }, i) => (
                  <LineSeries
                    key={curve}
                    curve={curve}
                    stroke={allColors.cyan[i + 2]}
                    strokeWidth={2}
                  />
                ))}
              </Sparkline>
            );
          }}
        </Example>
      </Spacer>
    ),
  },
];
