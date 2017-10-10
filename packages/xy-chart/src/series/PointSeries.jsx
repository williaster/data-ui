import React from 'react';
import PropTypes from 'prop-types';
import { GlyphDot } from '@vx/glyph';
import { Group } from '@vx/group';
import { chartTheme, color } from '@data-ui/theme';

import { callOrValue, isDefined } from '../utils/chartUtils';
import { pointSeriesDataShape } from '../utils/propShapes';

function GlyphDotComponent({
  key,
  x,
  y,
  size,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  strokeDasharray,
  onMouseMove,
  onMouseLeave,
  data,
  datum,
}) {
  return (
    <GlyphDot
      key={key}
      cx={x}
      cy={y}
      r={size}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      onMouseMove={onMouseMove && ((event) => {
        onMouseMove({ event, data, datum, color: fill });
      })}
      onMouseLeave={onMouseLeave}
    />
  )
}

export const propTypes = {
  data: pointSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,
  labelComponent: PropTypes.element,
  pointComponent: PropTypes.element,
  // attributes on data points will override these
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export const defaultProps = {
  labelComponent: <text {...chartTheme.labelStyles} />,
  pointComponent: GlyphDotComponent,
  size: 4,
  fill: color.default,
  fillOpacity: 0.8,
  stroke: '#FFFFFF',
  strokeDasharray: null,
  strokeWidth: 1,
  xScale: null,
  yScale: null,
  onMouseMove: null,
  onMouseLeave: null,
};

const x = d => d.x;
const y = d => d.y;

export default class PointSeries extends React.PureComponent {
  render() {
    const {
      data,
      label,
      labelComponent,
      fill,
      fillOpacity,
      size,
      stroke,
      strokeWidth,
      strokeDasharray,
      xScale,
      yScale,
      onMouseMove,
      onMouseLeave,
      pointComponent,
    } = this.props;
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
          const computedFill = d.fill || callOrValue(fill, d, i);
          const key = `${label}-${x(d)}-${i}`;
          if (defined && d.label) {
            labels.push({ x: cx, y: cy, label: d.label, key: `${key}-label` });
          }
          const computedSize = d.size || callOrValue(size, d, i);
          const computedFillOpacity = d.fillOpacity || callOrValue(fillOpacity, d, i);
          const computedStroke = d.stroke || callOrValue(stroke, d, i);
          const computedStrokeWidth = d.strokeWidth || callOrValue(strokeWidth, d, i);
          const computedStrokeDasharray = d.strokeDasharray || callOrValue(strokeDasharray, d, i);
          return defined &&
            React.createElement(pointComponent, {
              key,
              x: cx,
              y: cy,
              size: computedSize,
              fill: computedFill,
              fillOpacity: computedFillOpacity,
              stroke: computedStroke,
              strokeWidth: computedStrokeWidth,
              strokeDasharray: computedStrokeDasharray,
              onMouseMove,
              onMouseLeave,
              data,
              datum: d,
            });
        })}
        {/* Put labels on top */}
        {labels.map(d => React.cloneElement(labelComponent, d, d.label))}
      </Group>
    );
  }
}

PointSeries.propTypes = propTypes;
PointSeries.defaultProps = defaultProps;
PointSeries.displayName = 'PointSeries';
