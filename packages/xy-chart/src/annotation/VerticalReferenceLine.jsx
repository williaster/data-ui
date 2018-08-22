import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import { Line } from '@vx/shape';
import { Point } from '@vx/point';
import { Text } from '@vx/text';
import { color, svgLabel } from '@data-ui/theme';

const { baseLabel } = svgLabel;

export const defaultLabelProps = {
  ...baseLabel,
  textAnchor: 'start',
  verticalAnchor: 'middle',
  stroke: '#fff',
  strokeWidth: 2,
  paintOrder: 'stroke',
  y: 0,
  dx: '0.4em',
};

export const propTypes = {
  label: PropTypes.node,
  labelProps: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  reference: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeDasharray: PropTypes.string,
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

const defaultProps = {
  label: null,
  labelProps: defaultLabelProps,
  stroke: color.darkGray,
  strokeDasharray: null,
  strokeLinecap: 'round',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
};

function VerticalReferenceLine({
  label,
  labelProps,
  reference,
  stroke,
  strokeDasharray,
  strokeLinecap,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale) return null;
  const [y0, y1] = yScale.range();
  const scaledRef = //
    xScale(reference) + (xScale.offset || (xScale.bandwidth && xScale.bandwidth() / 2) || 0);
  const fromPoint = new Point({ x: scaledRef, y: y0 });
  const toPoint = new Point({ x: scaledRef, y: y1 });

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
      {Boolean(label) && (
        <Text x={scaledRef} {...defaultLabelProps} {...labelProps}>
          {label}
        </Text>
      )}
    </Group>
  );
}

VerticalReferenceLine.propTypes = propTypes;
VerticalReferenceLine.defaultProps = defaultProps;
VerticalReferenceLine.displayName = 'VerticalReferenceLine';

export default VerticalReferenceLine;
