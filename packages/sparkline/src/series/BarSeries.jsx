import PropTypes from 'prop-types';
import React from 'react';

import Group from '@vx/group/build/Group';
import Bar from '@vx/shape/build/shapes/Bar';
import color from '@data-ui/theme/build/color';
import svgLabel from '@data-ui/theme/build/svgLabel';

import Label from '../annotation/Label';
import callOrValue from '../utils/callOrValue';
import positionLabel from '../utils/positionLabel';

export const propTypes = {
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  LabelComponent: PropTypes.element,
  labelPosition: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf(['auto', 'top', 'right', 'bottom', 'left']),
  ]),
  labelOffset: PropTypes.number,
  renderLabel: PropTypes.func, // (d, i) => node
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // all likely passed by the parent chart
  data: PropTypes.array,
  getX: PropTypes.func,
  getY: PropTypes.func,
  // @TODO width + height?
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  fill: color.default,
  fillOpacity: 0.7,
  getX: null,
  getY: null,
  labelOffset: 8,
  LabelComponent: <Label {...svgLabel.baseTickLabel} stroke="#fff" />,
  labelPosition: 'top',
  renderLabel: null,
  stroke: '#fff',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
};

function BarSeries({
  data,
  getX,
  getY,
  fill,
  fillOpacity,
  labelOffset,
  LabelComponent,
  labelPosition,
  renderLabel,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getX || !getY || !data.length) return null;
  const barWidth = Math.max(1, (Math.max(...xScale.range()) / data.length) - 1);
  const maxBarHeight = Math.max(...yScale.range());
  const labels = []; // render labels as top-most layer

  return (
    <Group>
      {data.map((d, i) => {
        const x = xScale(getX(d));
        const y = yScale(getY(d));
        const key = `bar-${x}-${y}-${i}`;
        const label = renderLabel && renderLabel(d, i);
        if (label) {
          labels.push({
            key,
            label,
            x,
            y,
            ...positionLabel(callOrValue(labelPosition, d, i), labelOffset),
          });
        }
        return (
          <Bar
            key={key}
            x={x - (barWidth / 2)}
            y={y}
            width={barWidth}
            height={maxBarHeight - y}
            fill={callOrValue(d.fill || fill, d, i)}
            fillOpacity={
              callOrValue(typeof d.fillOpacity !== 'undefined' ? d.fillOpacity : fillOpacity, d, i)
            }
            stroke={callOrValue(d.stroke || stroke, d, i)}
            strokeWidth={callOrValue(d.strokeWidth || strokeWidth, d, i)}
          />
        );
      })}
      {labels.map(labelProps => React.cloneElement(LabelComponent, labelProps))}
    </Group>
  );
}

BarSeries.propTypes = propTypes;
BarSeries.defaultProps = defaultProps;
BarSeries.displayName = 'BarSeries';

export default BarSeries;
