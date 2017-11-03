import React from 'react';
import { range } from 'd3-array';

import { color, allColors } from '@data-ui/theme';

import {
  Sparkline,

  BarSeries,
  LineSeries,
  PointSeries,

  BandLine,
  HorizontalReferenceLine,
  VerticalReferenceLine,
  WithTooltip,

  PatternLines,
} from '@data-ui/sparkline';

import Example from './Example';
import Spacer from '../shared/Spacer';

PatternLines.displayName = 'PatternLines';

const sparklineProps = {
  ariaLabel: 'This is a Sparkline of...',
  width: 500,
  height: 100,
  margin: { top: 24, right: 64, bottom: 24, left: 64 },
  valueAccessor: d => d.y,
};

const randomData = n => range(n).map((_, i) => ({
  y: Math.random() * (Math.random() > 0.2 ? 1 : 2),
  x: `Day ${i + 1}`,
}));

const renderLabel = d => d.toFixed(2);

const renderTooltip = ({ datum }) => ( // eslint-disable-line react/prop-types
  <div>
    {datum.x && <div>{datum.x}</div>}
    <div>{datum.y ? datum.y.toFixed(2) : '--'}</div>
  </div>
);

export default [
  {
    description: 'Kitchen sink',
    components: [
      Sparkline,
      BarSeries,
      LineSeries,
      PointSeries,
      HorizontalReferenceLine,
      VerticalReferenceLine,
      BandLine,
    ],
    example: () => (
      <Spacer top={2} left={2} flexDirection="column">
        {(data => (
          <Example>
            <WithTooltip renderTooltip={renderTooltip}>
              {({ onMouseMove, onMouseLeave, tooltipData }) => (
                <Sparkline
                  {...sparklineProps}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                  data={data}
                >
                  <BarSeries
                    fill={(d, i) => {
                      const indexToHighlight = tooltipData ? tooltipData.index : 5;
                      return allColors.grape[i === indexToHighlight ? 8 : 2];
                    }}
                    fillOpacity={0.8}
                    renderLabel={(d, i) => {
                      const indexToHighlight = tooltipData ? tooltipData.index : 5;
                      return i === indexToHighlight ? '🤔' : null;
                    }}
                  />
                </Sparkline>
              )}
            </WithTooltip>
          </Example>
        ))(randomData(35))}

        {(data => (
          <Example>
            <WithTooltip renderTooltip={renderTooltip}>
              {({ onMouseMove, onMouseLeave, tooltipData }) => (
                <Sparkline
                  {...sparklineProps}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                  data={data}
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
                  <PointSeries
                    points={['all']}
                    stroke={allColors.indigo[4]}
                    fill="#fff"
                    size={3}
                  />
                  <PointSeries
                    points={['last']}
                    fill={allColors.indigo[5]}
                    renderLabel={renderLabel}
                    labelPosition="right"
                  />
                  {tooltipData && [
                    <VerticalReferenceLine
                      key="ref-line"
                      strokeWidth={1}
                      reference={tooltipData.index}
                      strokeDasharray="4 4"
                    />,
                    <PointSeries
                      key="ref-point"
                      points={[tooltipData.index]}
                      fill={allColors.indigo[5]}
                    />,
                  ]}
                </Sparkline>
              )}
            </WithTooltip>
          </Example>
        ))(randomData(25))}

        {(data => (
          <Example>
            <WithTooltip renderTooltip={renderTooltip}>
              {({ onMouseMove, onMouseLeave, tooltipData }) => (
                <Sparkline
                  {...sparklineProps}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                  data={data}
                >
                  <LineSeries
                    stroke={color.categories[2]}
                    strokeDasharray="2,2"
                    strokeLinecap="butt"
                  />
                  <PointSeries
                    points={['all']}
                    size={3}
                    fill={color.categories[2]}
                    strokeWidth={0}
                  />
                  <PointSeries
                    points={['min', 'max']}
                    fill={color.categories[1]}
                    size={5}
                    stroke="#fff"
                    renderLabel={renderLabel}
                  />
                  {tooltipData && [
                    <VerticalReferenceLine
                      key="ref-line"
                      strokeWidth={1}
                      reference={tooltipData.index}
                      strokeDasharray="4 4"
                    />,
                    <PointSeries
                      key="ref-point"
                      points={[tooltipData.index]}
                      fill="#fff"
                      stroke={color.categories[2]}
                    />,
                  ]}
                </Sparkline>
              )}
            </WithTooltip>
          </Example>
        ))(randomData(25))}

        {(data => (
          <Example>
            <WithTooltip renderTooltip={renderTooltip}>
              {({ onMouseMove, onMouseLeave, tooltipData }) => (
                <Sparkline
                  {...sparklineProps}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                  data={data}
                >
                  <HorizontalReferenceLine
                    stroke={allColors.cyan[8]}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <LineSeries stroke={allColors.cyan[4]} />
                  <PointSeries
                    points={['first', 'last']}
                    fill={allColors.cyan[7]}
                    size={5}
                    stroke="#fff"
                    renderLabel={renderLabel}
                    labelPosition={(d, i) => (i === 0 ? 'left' : 'right')}
                  />
                  {tooltipData && [
                    <VerticalReferenceLine
                      key="ref-line"
                      strokeWidth={1}
                      reference={tooltipData.index}
                      strokeDasharray="4 4"
                    />,
                    <PointSeries
                      key="ref-point"
                      points={[tooltipData.index]}
                      fill={color.categories[1]}
                    />,
                  ]}
                </Sparkline>
              )}
            </WithTooltip>
          </Example>
        ))(randomData(25))}

        {(data => (
          <Example>
            <WithTooltip renderTooltip={renderTooltip}>
              {({ onMouseMove, onMouseLeave, tooltipData }) => (
                <Sparkline
                  {...sparklineProps}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                  data={data}
                >
                  <PatternLines
                    id="band_pattern"
                    height={6}
                    width={6}
                    stroke={allColors.grape[6]}
                    strokeWidth={1}
                    orientation={['diagonal']}
                  />
                  <BandLine fill="url(#band_pattern)" />
                  <HorizontalReferenceLine
                    stroke={allColors.grape[8]}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    reference="median"
                  />
                  <VerticalReferenceLine
                    reference="min"
                    stroke={allColors.grape[3]}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <VerticalReferenceLine
                    reference="max"
                    stroke={allColors.grape[3]}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  <LineSeries stroke={allColors.grape[7]} />
                  <PointSeries
                    points={['min', 'max']}
                    fill={allColors.grape[3]}
                    size={5}
                    stroke="#fff"
                    renderLabel={renderLabel}
                  />
                  {tooltipData && [
                    <VerticalReferenceLine
                      key="ref-line"
                      strokeWidth={1}
                      reference={tooltipData.index}
                      strokeDasharray="4 4"
                    />,
                    <PointSeries
                      key="ref-point"
                      points={[tooltipData.index]}
                      fill={allColors.grape[3]}
                    />,
                  ]}
                </Sparkline>
              )}
            </WithTooltip>
          </Example>
        ))(randomData(45))}

        {(data => (
          <Example>
            <WithTooltip renderTooltip={renderTooltip}>
              {({ onMouseMove, onMouseLeave, tooltipData }) => (
                <Sparkline
                  {...sparklineProps}
                  onMouseLeave={onMouseLeave}
                  onMouseMove={onMouseMove}
                  data={data}
                >
                  <PatternLines
                    id="band_pattern_hash"
                    height={7}
                    width={7}
                    stroke={color.grays[5]}
                    strokeWidth={1}
                    orientation={['vertical', 'horizontal']}
                  />
                  <BandLine
                    fill="url(#band_pattern_hash)"
                    stroke={color.grays[5]}
                    band={{ from: {}, to: {} }}
                  />
                  <HorizontalReferenceLine
                    stroke={color.grays[8]}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    reference="median"
                  />
                  <LineSeries stroke={color.grays[7]} />
                  <PointSeries
                    points={['min', 'max']}
                    fill={color.grays[5]}
                    size={5}
                    stroke="#fff"
                    renderLabel={renderLabel}
                  />
                  {tooltipData && [
                    <VerticalReferenceLine
                      key="ref-line"
                      strokeWidth={1}
                      reference={tooltipData.index}
                      strokeDasharray="4 4"
                    />,
                    <PointSeries
                      key="ref-point"
                      points={[tooltipData.index]}
                      fill={color.grays[8]}
                    />,
                  ]}
                </Sparkline>
              )}
            </WithTooltip>
          </Example>
        ))(randomData(35))}
      </Spacer>
    ),
  },
];
