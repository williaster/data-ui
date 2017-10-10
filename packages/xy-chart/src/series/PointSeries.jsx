import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { chartTheme, color } from '@data-ui/theme';

import { callOrValue, isDefined } from '../utils/chartUtils';
import { pointSeriesDataShape } from '../utils/propShapes';
import GlyphDotComponent from '../glyph/GlyphDotComponent';

export const pointComponentPropTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  fillOpacity: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  strokeDasharray: PropTypes.string,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  data: pointSeriesDataShape.isRequired,
  datum: PropTypes.object.isRequired,
};

export const propTypes = {
  data: pointSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,
  labelComponent: PropTypes.element,
  pointComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
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
          const xVal = d.x;
          const yVal = d.y;
          const defined = isDefined(xVal) && isDefined(yVal);
          const x = xScale(xVal);
          const y = yScale(yVal);
          const computedFill = d.fill || callOrValue(fill, d, i);
          const key = `${label}-${d.x}-${i}`;
          if (defined && d.label) {
            labels.push({ x, y, label: d.label, key: `${key}-label` });
          }
          const computedSize = d.size || callOrValue(size, d, i);
          const computedFillOpacity = d.fillOpacity || callOrValue(fillOpacity, d, i);
          const computedStroke = d.stroke || callOrValue(stroke, d, i);
          const computedStrokeWidth = d.strokeWidth || callOrValue(strokeWidth, d, i);
          const computedStrokeDasharray = d.strokeDasharray || callOrValue(strokeDasharray, d, i);
          const props = {
            key,
            x,
            y,
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
          };
          return defined &&
            React.createElement(pointComponent, props);
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
