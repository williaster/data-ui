import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import callOrValue from '../utils/callOrValue';

const propTypes = {
  rawData: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  binnedData: PropTypes.array,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  horizontal: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  valueKey: PropTypes.string,

  // likely injected by parent Histogram
  binScale: PropTypes.func,
  valueScale: PropTypes.func,
  // renderLabel: PropTypes.func,
};

const defaultProps = {
  rawData: [],
  binnedData: [],
  binScale: null,
  fill: '#008489',
  fillOpacity: 0.7,
  horizontal: false,
  stroke: '#FFFFFF',
  strokeWidth: 1,
  valueKey: 'count',
  valueScale: null,
};

function BarSeries({
  binnedData,
  binScale,
  fill,
  fillOpacity,
  horizontal,
  stroke,
  strokeWidth,
  valueKey,
  valueScale,
}) {
  if (!binScale || !valueScale || !binnedData || binnedData.length === 0) return null;

  const maxBarLength = Math.max(...valueScale.range());
  const barWidth = binScale.bandwidth
      ? binScale.bandwidth() // categorical
      : Math.abs(binScale(binnedData[0].bin1) - binScale(binnedData[0].bin0)); // numeric

  console.log('bar data', binnedData);

  return (
    <Group>
      {binnedData.map((d, i) => {
        const binPosition = binScale(d.bin || (horizontal ? d.bin1 : d.bin0));
        const barLength = horizontal
          ? valueScale(d[valueKey])
          : maxBarLength - valueScale(d[valueKey]);

        return (
          <Bar
            key={`bar-${binPosition}`}
            x={horizontal ? 0 : binPosition}
            y={horizontal ? binPosition : (maxBarLength - barLength)}
            width={horizontal ? barLength : barWidth}
            height={horizontal ? barWidth : barLength}
            fill={d.fill || callOrValue(fill, d, i)}
            fillOpacity={
              typeof fillOpacity !== 'undefined' ? fillOpacity : callOrValue(fillOpacity, d, i)
            }
            stroke={d.stroke || callOrValue(stroke, d, i)}
            strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
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
