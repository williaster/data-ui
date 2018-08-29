import { Bar } from '@vx/shape';
import { FocusBlurHandler } from '@data-ui/shared';
import { Group } from '@vx/group';
import PropTypes from 'prop-types';
import React from 'react';
import { color as themeColors } from '@data-ui/theme';

import { barSeriesDataShape } from '../utils/propShapes';
import { callOrValue, isDefined } from '../utils/chartUtils';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,
  data: barSeriesDataShape.isRequired,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  horizontal: PropTypes.bool,
};

const defaultProps = {
  fill: themeColors.default,
  fillOpacity: null,
  stroke: '#FFFFFF',
  strokeWidth: 1,
  horizontal: false,
};

const x = d => d.x;
const y = d => d.y;
const noEventsStyles = { pointerEvents: 'none' };

export default class BarSeries extends React.PureComponent {
  render() {
    const {
      data,
      disableMouseEvents,
      fill,
      fillOpacity,
      stroke,
      strokeWidth,
      xScale,
      yScale,
      onClick,
      onMouseMove,
      onMouseLeave,
      horizontal,
    } = this.props;
    if (!xScale || !yScale) return null;
    const valueScale = horizontal ? xScale : yScale;
    const categoryScale = horizontal ? yScale : xScale;
    const barWidth =
      categoryScale.barWidth || (categoryScale.bandwidth && categoryScale.bandwidth()) || 0;
    const valueField = horizontal ? x : y;
    const categoryField = horizontal ? y : x;

    const maxBarLength = Math.max(...valueScale.range());
    const offset = categoryScale.offset || 0;

    return (
      <Group style={disableMouseEvents ? noEventsStyles : null}>
        {data.map((d, i) => {
          const barLength = horizontal
            ? valueScale(valueField(d))
            : maxBarLength - valueScale(valueField(d));
          const color = d.fill || callOrValue(fill, d, i);
          const barPosition = categoryScale(categoryField(d)) - offset;

          return (
            isDefined(horizontal ? d.x : d.y) && (
              <FocusBlurHandler
                key={`bar-${barPosition}`}
                onBlur={disableMouseEvents ? null : onMouseLeave}
                onFocus={
                  disableMouseEvents
                    ? null
                    : event => {
                        onMouseMove({ event, data, datum: d, color, index: i });
                      }
                }
              >
                <Bar
                  x={horizontal ? 0 : barPosition}
                  y={horizontal ? barPosition : maxBarLength - barLength}
                  width={horizontal ? barLength : barWidth}
                  height={horizontal ? barWidth : barLength}
                  fill={color}
                  fillOpacity={d.fillOpacity || callOrValue(fillOpacity, d, i)}
                  stroke={d.stroke || callOrValue(stroke, d, i)}
                  strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
                  onClick={
                    disableMouseEvents
                      ? null
                      : onClick &&
                        (() => event => {
                          onClick({ event, data, datum: d, color, index: i });
                        })
                  }
                  onMouseMove={
                    disableMouseEvents
                      ? null
                      : onMouseMove &&
                        (() => event => {
                          onMouseMove({
                            event,
                            data,
                            datum: d,
                            color,
                            index: i,
                          });
                        })
                  }
                  onMouseLeave={disableMouseEvents ? null : onMouseLeave && (() => onMouseLeave)}
                />
              </FocusBlurHandler>
            )
          );
        })}
      </Group>
    );
  }
}

BarSeries.propTypes = propTypes;
BarSeries.defaultProps = defaultProps;
BarSeries.displayName = 'BarSeries';
