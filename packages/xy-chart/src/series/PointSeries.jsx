import React from 'react';
import PropTypes from 'prop-types';

import { Group } from '@vx/group';
import { GlyphDot } from '@vx/glyph';

import { callOrValue, isDefined } from '../utils/chartUtils';
import { labelStyles, colors } from '../theme';
import { pointSeriesDataShape } from '../utils/propShapes';

const propTypes = {
  data: pointSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,
  labelComponent: PropTypes.element,

  // attributes on data points will override these
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // these will likely be injected by the parent chart
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
};

const defaultProps = {
  labelComponent: <text {...labelStyles} />,
  size: 4,
  fill: colors.default,
  stroke: '#FFFFFF',
  strokeDasharray: null,
  strokeWidth: 1,
};

const x = d => d.x;
const y = d => d.y;

export default function PointSeries({
  data,
  label,
  labelComponent,
  fill,
  size,
  stroke,
  strokeWidth,
  strokeDasharray,
  xScale,
  yScale,
}) {
  const labels = [];
  return (
    <Group key={label}>
      {data.map((d, i) => {
        const cx = xScale(x(d));
        const cy = yScale(y(d));
        const defined = isDefined(cx) && isDefined(cy);
        if (defined && d.label) {
          labels.push({ x: cx, y: cy, label: d.label });
        }
        return defined && (
          <GlyphDot
            key={`${label}-${x(d)}`}
            cx={cx}
            cy={cy}
            r={callOrValue(size, d, i)}
            fill={d.fill || callOrValue(fill, d, i)}
            stroke={d.stroke || callOrValue(stroke, d, i)}
            strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
            strokeDasharray={d.strokeDasharray || callOrValue(strokeDasharray, d, i)}
          />
        );
      })}
      {/* Put labels on top */}
      {labels.map(d => React.cloneElement(labelComponent, d, d.label))}
    </Group>
  );
}

PointSeries.propTypes = propTypes;
PointSeries.defaultProps = defaultProps;
PointSeries.displayName = 'PointSeries';
