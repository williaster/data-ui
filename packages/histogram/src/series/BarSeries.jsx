import PropTypes from 'prop-types';
import React from 'react';
import { NodeGroup } from 'resonance';

import { chartTheme } from '@data-ui/theme';
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
  fill: chartTheme.colors.default,
  fillOpacity: 0.7,
  horizontal: false,
  stroke: '#FFFFFF',
  strokeWidth: 1,
  valueKey: 'count',
  valueScale: null,
};

const getBin = d => (typeof d.bin !== 'undefined' ? d.bin : d.bin0);
const getBin1 = d => (typeof d.bin !== 'undefined' ? d.bin : d.bin1);

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

  console.log('render bar');
  const getValue = d => d[valueKey];

  const getX = horizontal ? getValue : getBin;
  const getY = horizontal ? getBin1 : getValue;
  const xScale = horizontal ? valueScale : binScale;
  const yScale = horizontal ? binScale : valueScale;

  return (
    <Group>
      <NodeGroup
        data={binnedData}
        keyAccessor={d => d.id}
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
              // debugger;
              const { key, data: rawDatum, state: d } = modifiedDatum;
              return (
                <Bar
                  key={`bar-${key}`}
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
    </Group>
  );
}

BarSeries.propTypes = propTypes;
BarSeries.defaultProps = defaultProps;
BarSeries.displayName = 'BarSeries';

export default BarSeries;
