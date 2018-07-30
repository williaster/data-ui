import PropTypes from 'prop-types';
import React from 'react';
import { NodeGroup } from 'react-move';

import { chartTheme } from '@data-ui/theme';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import callOrValue from '../../utils/callOrValue';
import { binnedDataShape } from '../../utils/propShapes';

const propTypes = {
  rawData: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), // eslint-disable-line react/no-unused-prop-types
  binnedData: binnedDataShape,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  horizontal: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  valueKey: PropTypes.string,
  onClick: PropTypes.func,

  // likely injected by parent Histogram
  binScale: PropTypes.func,
  valueScale: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,

  keyAccessor: PropTypes.func,
};

const defaultProps = {
  rawData: [],
  binnedData: [],
  binScale: null,
  fill: chartTheme.colors.default,
  fillOpacity: 0.7,
  horizontal: false,
  onClick: null,
  onMouseMove: null,
  onMouseLeave: null,
  stroke: '#FFFFFF',
  strokeWidth: 1,
  valueKey: 'count',
  valueScale: null,
  keyAccessor: d => d.id,
};

const INDEX_DELAY_MULTIPLIER = 10;
const getBin = d => (typeof d.bin === 'undefined' ? d.bin0 : d.bin);
const getBin1 = d => (typeof d.bin === 'undefined' ? d.bin1 : d.bin);

function AnimatedBarSeries({
  binnedData,
  valueScale,
  binScale,
  horizontal,
  keyAccessor,
  fill,
  fillOpacity,
  onClick,
  onMouseMove,
  onMouseLeave,
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
      start={(d, i) => ({
        x: horizontal ? 0 : xScale(getX(d)),
        y: horizontal ? yScale(getY(d)) : maxBarLength,
        fill: d.fill || callOrValue(fill, d, i),
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
        timing: { duration: 300, delay: INDEX_DELAY_MULTIPLIER * i },
      })}
      update={(d, i) => ({
        x: [horizontal ? 0 : xScale(getX(d))],
        y: [yScale(getY(d))],
        width: [horizontal ? xScale(getX(d)) : barWidth],
        height: [horizontal ? barWidth : maxBarLength - yScale(getY(d))],
        fill: [d.fill || callOrValue(fill, d, i)],
        stroke: [d.stroke || callOrValue(stroke, d, i)],
        timing: { duration: 300, delay: INDEX_DELAY_MULTIPLIER * i },
      })}
      leave={(d, i) => ({
        x: horizontal ? 0 : xScale(getX(d)),
        y: horizontal ? yScale(getY(d)) : maxBarLength,
        width: horizontal ? 0 : barWidth,
        height: horizontal ? barWidth : 0,
        timing: { duration: 300, delay: (INDEX_DELAY_MULTIPLIER / 2) * i },
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
                  typeof fillOpacity === 'undefined'
                    ? callOrValue(fillOpacity, rawDatum, i)
                    : fillOpacity
                }
                strokeWidth={rawDatum.strokeWidth || callOrValue(strokeWidth, rawDatum, i)}
                onClick={
                  onClick &&
                  (() => event => {
                    onClick({ event, datum: rawDatum, data: binnedData, color: d.fill, index: i });
                  })
                }
                onMouseMove={
                  onMouseMove &&
                  (() => event => {
                    onMouseMove({
                      event,
                      datum: rawDatum,
                      data: binnedData,
                      color: d.fill,
                      index: i,
                    });
                  })
                }
                onMouseLeave={onMouseLeave && (() => onMouseLeave)}
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
