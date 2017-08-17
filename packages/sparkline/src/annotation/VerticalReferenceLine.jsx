import PropTypes from 'prop-types';
import React from 'react';
import { mean, median, max, min } from 'd3-array';

import Group from '@vx/group/build/Group';
import Line from '@vx/shape/build/shapes/Line';
import Point from '@vx/point/build/Point';
import color from '@data-ui/theme/build/color';
import svgLabel from '@data-ui/theme/build/svgLabel';

import Label from '../annotation/Label';
import positionLabel from '../utils/positionLabel';

export const propTypes = {
  reference: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([
      'first',
      'last',
      'min',
      'max',
    ]),
  ]),
  LabelComponent: PropTypes.element,
  labelOffset: PropTypes.number,
  labelPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  renderLabel: PropTypes.func,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // all likely passed by the parent chart
  data: PropTypes.array,
  getX: PropTypes.func,
  getY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  getX: null,
  getY: null,
  LabelComponent: <Label {...svgLabel.baseTickLabel} stroke="#fff" />,
  labelOffset: 10,
  labelPosition: 'top',
  orientation: 'horizontal',
  reference: 'mean',
  renderLabel: null,
  stroke: color.darkGray,
  strokeDasharray: null,
  strokeLinecap: 'round',
  strokeWidth: 2,
  xScale: null,
  yScale: null,
};

function VerticalReferenceLine({
  data,
  getX,
  getY,
  LabelComponent,
  labelOffset,
  labelPosition,
  reference,
  renderLabel,
  stroke,
  strokeDasharray,
  strokeLinecap,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getY || !data.length) return null;
  const [y1, y0] = yScale.range();
  const [yMin, yMax] = yScale.domain();

  // use an index if passed, else find the index based on the ref type
  const index = typeof reference === 'number'
    ? reference
    : data.findIndex((d, i) => (
      (reference === 'first' && i === 0)
      || (reference === 'last' && i === data.length - 1)
      || (reference === 'min' && Math.abs(getY(d) - yMin) < 0.00001)
      || (reference === 'max' && Math.abs(getY(d) - yMax) < 0.00001)
    ));

  const datum = data[index];
  if (!datum) return null;

  const refNumber = getX(datum);
  const scaledRef = xScale(refNumber);
  const fromPoint = new Point({ x: scaledRef, y: y0 });
  const toPoint = new Point({ x: scaledRef, y: y1 });
  const label = renderLabel && renderLabel(refNumber);

  return (
    <Group>
      <Line
        from={fromPoint}
        to={toPoint}
        stroke={stroke}
        strokeDasharray={strokeDasharray}
        strokeLinecap={strokeLinecap}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
      {label && React.cloneElement(LabelComponent, {
        x: toPoint.x,
        y: toPoint.y,
        ...positionLabel(labelPosition, labelOffset),
        label,
      })}
    </Group>
  );
}

VerticalReferenceLine.propTypes = propTypes;
VerticalReferenceLine.defaultProps = defaultProps;
VerticalReferenceLine.displayName = 'VerticalReferenceLine';

export default VerticalReferenceLine;
