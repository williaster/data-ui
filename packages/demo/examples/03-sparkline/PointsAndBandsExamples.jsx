/* eslint react/no-array-index-key: 0 */
import React from 'react';
import { range } from 'd3-array';

import {
  Sparkline,
  LineSeries,
  PointSeries,

  BandLine,
  HorizontalReferenceLine,
  VerticalReferenceLine,
  WithTooltip,

  PatternLines,
  withScreenSize,
} from '@data-ui/sparkline';

import { allColors } from '@data-ui/theme';

import Example from './Example';
import Spacer from '../shared/Spacer';

PatternLines.displayName = 'PatternLines';

const sparklineProps = {
  ariaLabel: 'This is a Sparkline of...',
  width: 500,
  height: 100,
  margin: { top: 24, right: 72, bottom: 24, left: 8 },
};

const randomData = n => range(n).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)));
const ResponsiveSparkline = withScreenSize(({ screenWidth, width, ...rest }) => (
  <Sparkline
    width={Math.min(
      sparklineProps.width,
      Math.max(20, screenWidth * 0.65),
    )}
    {...rest}
  />
));

export default [
  {
    description: 'Miscellaneous❗️',
    components: [
      Sparkline,
      LineSeries,
    ],
    example: () => (
      <Spacer top={2} left={2} flexDirection="column">
        <Example title="All points">
          <Sparkline
            {...sparklineProps}
            data={randomData(40)}
          >
            <LineSeries
              strokeWidth={1}
              stroke={allColors.cyan[3]}
            />
            <PointSeries points={['all']} />
            <PointSeries points={['max']} fill={allColors.yellow[6]} />
          </Sparkline>
        </Example>

        <Example title="Same scales for comparison">
          <Spacer flexDirection="column"r>
            {[9, 3].map(multiplier => (
              <Sparkline
                key={multiplier}
                {...sparklineProps}
                height={50}
                margin={{ ...sparklineProps.margin, top: 8, bottom: 4 }}
                data={range(25).map(() => Math.random() * multiplier)}
                min={0}
                max={10}
              >
                <BandLine
                  fill={allColors.teal[1]}
                  band={{ from: {}, to: {} }}
                />
                <HorizontalReferenceLine
                  reference={10}
                  stroke={allColors.teal[7]}
                  strokeDasharray="3,3"
                  strokeLinecap="square"
                  strokeWidth={1}
                  renderLabel={d => <tspan fill={allColors.teal[7]}>{d.toFixed(1)}</tspan>}
                />
                <LineSeries
                  curve="cardinal"
                  strokeWidth={2}
                  stroke={allColors.teal[6]}
                />
                <PointSeries
                  points={['min', 'max']}
                  fill={allColors.teal[6]}
                />
              </Sparkline>
            ))}
          </Spacer>
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

        {(data =>
          (<Example title="Vertical lines for every point + CrossHair tooltip">
            <WithTooltip renderTooltip={({ datum }) => datum.y.toFixed(2)}>
              {({ onMouseMove, onMouseLeave, tooltipData }) => (
                <Sparkline
                  {...sparklineProps}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                  data={data}
                >
                  {range(30).map((_, i) => (
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

                  {tooltipData && [
                    <HorizontalReferenceLine
                      key="ref-hline"
                      strokeWidth={1}
                      stroke={allColors.pink[8]}
                      reference={tooltipData.datum.y}
                      strokeDasharray="4,4"
                    />,
                    <VerticalReferenceLine
                      key="ref-vline"
                      strokeWidth={1}
                      stroke={allColors.pink[8]}
                      reference={tooltipData.index}
                      strokeDasharray="4,4"
                    />,
                    <PointSeries
                      key="ref-point"
                      points={[tooltipData.index]}
                      fill={allColors.pink[8]}
                    />,
                  ]}
                </Sparkline>
              )}
            </WithTooltip>
          </Example>))(randomData(30))}

        <Example title="Responsive">
          <ResponsiveSparkline
            {...sparklineProps}
            data={randomData(25)}
          >
            <PatternLines
              id="area_pattern"
              height={4}
              width={4}
              stroke={allColors.indigo[4]}
              strokeWidth={1}
              orientation={['diagonal']}
            />
            <LineSeries
              showArea
              stroke={allColors.indigo[5]}
              fill="url(#area_pattern)"
            />
          </ResponsiveSparkline>
        </Example>
      </Spacer>
    ),
  },
];
