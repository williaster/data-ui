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
      'mean',
      'median',
      'min',
      'max',
    ]),
  ]),
  LabelComponent: PropTypes.element,
  labelOffset: PropTypes.number,
  labelPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  renderLabel: PropTypes.func,
  stroke: PropTypes.string,
  strokeDasharray: PropTypes.string,
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.number,

  // all likely passed by the parent chart
  data: PropTypes.array,
  getY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  getY: null,
  LabelComponent: <Label {...svgLabel.baseTickLabel} stroke="#fff" />,
  labelOffset: 8,
  labelPosition: 'right',
  reference: 'mean',
  renderLabel: null,
  stroke: color.darkGray,
  strokeDasharray: null,
  strokeLinecap: 'round',
  strokeWidth: 2,
  xScale: null,
  yScale: null,
};

class HorizontalReferenceLine extends React.PureComponent {
  render() {
    const {
      data,
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
    } = this.props;
    if (!xScale || !yScale || !getY || !data.length) return null;
    const [x0, x1] = xScale.range();

    let refNumber = reference;
    if (reference === 'mean') refNumber = mean(data, getY);
    if (reference === 'median') refNumber = median(data, getY);
    if (reference === 'max') refNumber = max(data, getY);
    if (reference === 'min') refNumber = min(data, getY);

    const scaledRef = yScale(refNumber);
    const fromPoint = new Point({ x: x0, y: scaledRef });
    const toPoint = new Point({ x: x1, y: scaledRef });
    const label = renderLabel && renderLabel(refNumber);

    return (
      <Group style={{ pointerEvents: 'none' }}>
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
}

HorizontalReferenceLine.propTypes = propTypes;
HorizontalReferenceLine.defaultProps = defaultProps;
HorizontalReferenceLine.displayName = 'ReferenceLine';

export default HorizontalReferenceLine;
