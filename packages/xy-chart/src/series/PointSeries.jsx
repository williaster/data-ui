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

  // likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

const defaultProps = {
  labelComponent: <text {...labelStyles} />,
  size: 4,
  fill: colors.default,
  stroke: '#FFFFFF',
  strokeDasharray: null,
  strokeWidth: 1,
  xScale: null,
  yScale: null,
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
  if (!xScale || !yScale) return null;

  const labels = [];
  return (
    <Group key={label}>
      {data.map((d, i) => {
        const xVal = x(d);
        const yVal = y(d);
        const defined = isDefined(xVal) && isDefined(yVal);
        const cx = xScale(xVal);
        const cy = yScale(yVal);
        const key = `${label}-${x(d)}`;
        if (defined && d.label) {
          labels.push({ x: cx, y: cy, label: d.label, key: `${key}-label` });
        }
        return defined && (
          <GlyphDot
            key={key}
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
