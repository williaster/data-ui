import { svgLabel, color } from '@data-ui/theme';
import { FocusBlurHandler } from '@data-ui/shared';
import { Group } from '@vx/group';
import { Text } from '@vx/text';
import PropTypes from 'prop-types';
import React from 'react';

import { callOrValue, isDefined } from '../utils/chartUtils';
import GlyphDotComponent from '../glyph/GlyphDotComponent';
import { pointSeriesDataShape } from '../utils/propShapes';
import sharedSeriesProps from '../utils/sharedSeriesProps';

export const propTypes = {
  ...sharedSeriesProps,
  data: pointSeriesDataShape.isRequired,
  defaultLabelProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  pointComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  renderLabel: PropTypes.func,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
};

const { baseLabel } = svgLabel;

export const defaultLabelProps = {
  ...baseLabel,
  textAnchor: 'start',
  verticalAnchor: 'start',
  dx: '0.25em',
  dy: '0.25em',
  pointerEvents: 'none',
  stroke: '#fff',
  strokeWidth: 2,
  paintOrder: 'stroke',
  fontSize: 12,
};

export const defaultProps = {
  defaultLabelProps,
  // eslint-disable-next-line react/prop-types
  renderLabel: ({ datum, labelProps }) =>
    datum.label ? <Text {...labelProps}>{datum.label}</Text> : null,
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
      defaultLabelProps: labelProps,
      disableMouseEvents,
      fill,
      fillOpacity,
      renderLabel,
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
    const Labels = [];

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
          const computedSize = d.size || callOrValue(size, d, i);
          const computedFillOpacity = d.fillOpacity || callOrValue(fillOpacity, d, i);
          const computedStroke = d.stroke || callOrValue(stroke, d, i);
          const computedStrokeWidth = d.strokeWidth || callOrValue(strokeWidth, d, i);
          const computedStrokeDasharray = d.strokeDasharray || callOrValue(strokeDasharray, d, i);

          if (defined && renderLabel) {
            const Label = renderLabel({
              datum: d,
              index: i,
              labelProps: {
                key,
                ...labelProps,
                x,
                y,
              },
            });

            if (Label) Labels.push(Label);
          }

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
        {Labels.map(Label => Label)}
      </Group>
    );
  }
}

PointSeries.propTypes = propTypes;
PointSeries.defaultProps = defaultProps;
PointSeries.displayName = 'PointSeries';
