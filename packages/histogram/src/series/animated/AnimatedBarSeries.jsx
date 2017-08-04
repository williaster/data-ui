import PropTypes from 'prop-types';
import React from 'react';
import { NodeGroup } from 'resonance';

import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import {
  propTypes as BarSeriesPropTypes,
  defaultProps as BarSeriesDefaultProps,
} from '../BarSeries';

import callOrValue from '../../utils/callOrValue';

const propTypes = {
  ...BarSeriesPropTypes,
  keyAccessor: PropTypes.func,
};

const defaultProps = {
  ...BarSeriesDefaultProps,
  keyAccessor: d => d.id,
};

const getBin = d => (typeof d.bin !== 'undefined' ? d.bin : d.bin0);
const getBin1 = d => (typeof d.bin !== 'undefined' ? d.bin : d.bin1);

function AnimatedBarSeries({
  binnedData,
  valueScale,
  binScale,
  horizontal,
  keyAccessor,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  valueKey,
}) {
  const maxBarLength = Math.max(...valueScale.range());

  const barWidth = binScale.bandwidth
      ? binScale.bandwidth() // categorical
      : Math.abs(binScale(binnedData[0].bin1) - binScale(binnedData[0].bin0)); // numeric

  const getValue = d => d[valueKey];

  const getX = horizontal ? getValue : getBin;
  const getY = horizontal ? getBin1 : getValue;
  const xScale = horizontal ? valueScale : binScale;
  const yScale = horizontal ? binScale : valueScale;

  return (
    <NodeGroup
      data={binnedData}
      keyAccessor={keyAccessor}
      start={d => ({
        x: horizontal ? 0 : xScale(getX(d)),
        y: horizontal ? yScale(getY(d)) : maxBarLength,
        width: horizontal ? 0 : barWidth,
        height: horizontal ? barWidth : 0,
      })}
      enter={(d, i) => ({
        x: [horizontal ? 0 : xScale(getX(d))],
        y: [yScale(getY(d))],
        width: [horizontal ? xScale(getX(d)) : barWidth],
        height: [horizontal ? barWidth : maxBarLength - yScale(getY(d))],
        fill: [d.fill || callOrValue(fill, d, i)],
        stroke: [d.stroke || callOrValue(stroke, d, i)],
        timing: { duration: 300, delay: 10 * i },
      })}
      update={(d, i) => ({
        x: [horizontal ? 0 : xScale(getX(d))],
        y: [yScale(getY(d))],
        width: [horizontal ? xScale(getX(d)) : barWidth],
        height: [horizontal ? barWidth : maxBarLength - yScale(getY(d))],
        fill: [d.fill || callOrValue(fill, d, i)],
        stroke: [d.stroke || callOrValue(stroke, d, i)],
        timing: { duration: 300, delay: 10 * i },
      })}
      leave={(d, i) => ({
        x: horizontal ? 0 : xScale(getX(d)),
        y: horizontal ? yScale(getY(d)) : maxBarLength,
        width: horizontal ? 0 : barWidth,
        height: horizontal ? barWidth : 0,
        timing: { duration: 300, delay: 5 * i },
      })}
    >
      {data => (
        <Group>
          {data.map((modifiedDatum, i) => {
            const { key, data: rawDatum, state: d } = modifiedDatum;
            return (
              <Bar
                key={`bar${key}`}
                x={d.x}
                y={d.y}
                width={d.width}
                height={d.height}
                fill={d.fill}
                stroke={d.stroke}
                fillOpacity={
                  typeof fillOpacity !== 'undefined'
                  ? fillOpacity
                  : callOrValue(fillOpacity, rawDatum, i)
                }
                strokeWidth={rawDatum.strokeWidth || callOrValue(strokeWidth, rawDatum, i)}
              />
            );
          })}
        </Group>
      )}
    </NodeGroup>
  );
}

AnimatedBarSeries.propTypes = propTypes;
AnimatedBarSeries.defaultProps = defaultProps;

export default AnimatedBarSeries;
