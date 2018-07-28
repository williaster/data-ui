import chartTheme from '@data-ui/theme/build/chartTheme';
import color from '@data-ui/theme/build/color';
import FocusBlurHandler from '@data-ui/shared/build/components/FocusBlurHandler';
import { Group } from '@vx/group';
import PropTypes from 'prop-types';
import React from 'react';

import { callOrValue, isDefined } from '../utils/chartUtils';
import GlyphDotComponent from '../glyph/GlyphDotComponent';
import { pointSeriesDataShape } from '../utils/propShapes';
import sharedSeriesProps from '../utils/sharedSeriesProps';

export const propTypes = {
  ...sharedSeriesProps,
  data: pointSeriesDataShape.isRequired,
  labelComponent: PropTypes.element,
  pointComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
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
};

const noEventsStyles = { pointerEvents: 'none' };

export default class PointSeries extends React.PureComponent {
  render() {
    const {
      data,
      disableMouseEvents,
      labelComponent,
      fill,
      fillOpacity,
      size,
      stroke,
      strokeWidth,
      strokeDasharray,
      xScale,
      yScale,
      onClick,
      onMouseMove,
      onMouseLeave,
      pointComponent,
    } = this.props;
    if (!xScale || !yScale) return null;
    const labels = [];

    return (
      <Group style={disableMouseEvents ? noEventsStyles : null}>
        {data.map((d, i) => {
          const xVal = d.x;
          const yVal = d.y;
          const defined = isDefined(xVal) && isDefined(yVal);
          const x = xScale(xVal);
          const y = yScale(yVal);
          const computedFill = d.fill || callOrValue(fill, d, i);
          const key = `${d.x}-${i}`;
          if (defined && d.label) {
            labels.push({ x, y, label: d.label, key: `${key}-label` });
          }
          const computedSize = d.size || callOrValue(size, d, i);
          const computedFillOpacity = d.fillOpacity || callOrValue(fillOpacity, d, i);
          const computedStroke = d.stroke || callOrValue(stroke, d, i);
          const computedStrokeWidth = d.strokeWidth || callOrValue(strokeWidth, d, i);
          const computedStrokeDasharray = d.strokeDasharray || callOrValue(strokeDasharray, d, i);
          const props = {
            x,
            y,
            size: computedSize,
            fill: computedFill,
            fillOpacity: computedFillOpacity,
            stroke: computedStroke,
            strokeWidth: computedStrokeWidth,
            strokeDasharray: computedStrokeDasharray,
            onClick: disableMouseEvents ? null : onClick,
            onMouseMove: disableMouseEvents ? null : onMouseMove,
            onMouseLeave: disableMouseEvents ? null : onMouseLeave,
            data,
            datum: d,
          };

          return (
            defined && (
              <FocusBlurHandler
                key={key}
                xlinkHref="#"
                onBlur={disableMouseEvents ? null : props.onMouseLeave}
                onFocus={
                  disableMouseEvents
                    ? null
                    : event => {
                        onMouseMove({
                          event,
                          data,
                          datum: d,
                          color: computedFill,
                          index: i,
                        });
                      }
                }
              >
                {React.createElement(pointComponent, props)}
              </FocusBlurHandler>
            )
          );
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
