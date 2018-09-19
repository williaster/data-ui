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
  x: 0,
  dy: '-0.4em',
};

export const propTypes = {
  label: PropTypes.node,
  labelProps: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  reference: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]).isRequired,
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

function HorizontalReferenceLine({
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
  const [x0, x1] = xScale.range();
  const scaledRef = yScale(reference);
  const fromPoint = new Point({ x: x0, y: scaledRef });
  const toPoint = new Point({ x: x1, y: scaledRef });

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
        <Text y={scaledRef} {...defaultLabelProps} {...labelProps}>
          {label}
        </Text>
      )}
    </Group>
  );
}

HorizontalReferenceLine.propTypes = propTypes;
HorizontalReferenceLine.defaultProps = defaultProps;
HorizontalReferenceLine.displayName = 'HorizontalReferenceLine';

export default HorizontalReferenceLine;
