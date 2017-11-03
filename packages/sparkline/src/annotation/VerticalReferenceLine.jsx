import PropTypes from 'prop-types';
import React from 'react';

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
  stroke: PropTypes.string,
  strokeDasharray: PropTypes.string,
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.number,

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
  reference: 'last',
  renderLabel: null,
  stroke: color.darkGray,
  strokeDasharray: null,
  strokeLinecap: 'round',
  strokeWidth: 2,
  xScale: null,
  yScale: null,
};

class VerticalReferenceLine extends React.PureComponent {
  render() {
    const {
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
    } = this.props;
    if (!xScale || !yScale || !getY || !getX || !data.length) return null;
    const [y1, y0] = yScale.range();
    const [yMin, yMax] = yScale.domain();

    // use a number if passed, else find the index based on the ref type
    let index = reference;
    if (typeof reference !== 'number') {
      index = data.findIndex((d, i) => (
        (reference === 'first' && i === 0)
        || (reference === 'last' && i === data.length - 1)
        || (reference === 'min' && Math.abs(getY(d) - yMin) < 0.00001)
        || (reference === 'max' && Math.abs(getY(d) - yMax) < 0.00001)
      ));
    }
    const datum = data[index];
    // use passed value if no datum, this enables custom x values
    const refNumber = datum ? getX(datum) : index;
    const scaledRef = xScale(refNumber);
    const fromPoint = new Point({ x: scaledRef, y: y1 });
    const toPoint = new Point({ x: scaledRef, y: y0 });
    const label = renderLabel && renderLabel((datum && getY(datum)) || refNumber);

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

VerticalReferenceLine.propTypes = propTypes;
VerticalReferenceLine.defaultProps = defaultProps;
VerticalReferenceLine.displayName = 'VerticalReferenceLine';

export default VerticalReferenceLine;
