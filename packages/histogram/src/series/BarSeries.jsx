import PropTypes from 'prop-types';
import React from 'react';

import { chartTheme } from '@data-ui/theme';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import AnimatedBarSeries from './animated/AnimatedBarSeries';
import callOrValue from '../utils/callOrValue';
import { binnedDataShape } from '../utils/propShapes';

export const propTypes = {
  animated: PropTypes.bool,
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
};

export const defaultProps = {
  animated: true,
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
};

function BarSeries({
  animated,
  binnedData,
  binScale,
  fill,
  fillOpacity,
  horizontal,
  onClick,
  onMouseMove,
  onMouseLeave,
  stroke,
  strokeWidth,
  valueKey,
  valueScale,
}) {
  if (!binScale || !valueScale || !binnedData || binnedData.length === 0) return null;

  const maxBarLength = Math.max(...valueScale.range());

  // @TODO with custom bin values, bin1 - bin0 may be different for each bar, account for this
  const barWidth = binScale.bandwidth
    ? binScale.bandwidth() // categorical
    : Math.abs(binScale(binnedData[0].bin1) - binScale(binnedData[0].bin0)); // numeric

  return (
    <Group>
      {animated && (
        <AnimatedBarSeries
          binnedData={binnedData}
          binScale={binScale}
          horizontal={horizontal}
          fill={fill}
          fillOpacity={fillOpacity}
          onClick={onClick}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          stroke={stroke}
          strokeWidth={strokeWidth}
          valueKey={valueKey}
          valueScale={valueScale}
        />
      )}

      {!animated &&
        binnedData.map((d, i) => {
          const binPosition = binScale(d.bin || (horizontal ? d.bin1 : d.bin0));
          const barLength = horizontal
            ? valueScale(d[valueKey])
            : maxBarLength - valueScale(d[valueKey]);

          const color = d.fill || callOrValue(fill, d, i);

          return (
            <Bar
              key={`bar-${binPosition}`}
              x={horizontal ? 0 : binPosition}
              y={horizontal ? binPosition : maxBarLength - barLength}
              width={horizontal ? barLength : barWidth}
              height={horizontal ? barWidth : barLength}
              fill={color}
              fillOpacity={
                typeof fillOpacity === 'undefined' ? callOrValue(fillOpacity, d, i) : fillOpacity
              }
              stroke={d.stroke || callOrValue(stroke, d, i)}
              strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
              onClick={
                onClick &&
                (() => event => {
                  onClick({ event, data: binnedData, datum: d, color, index: i });
                })
              }
              onMouseMove={
                onMouseMove &&
                (() => event => {
                  onMouseMove({ event, data: binnedData, datum: d, color, index: i });
                })
              }
              onMouseLeave={onMouseLeave && (() => onMouseLeave)}
            />
          );
        })}
    </Group>
  );
}

BarSeries.propTypes = propTypes;
BarSeries.defaultProps = defaultProps;
BarSeries.displayName = 'BarSeries';

export default BarSeries;
