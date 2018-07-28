import { Bar } from '@vx/shape';
import FocusBlurHandler from '@data-ui/shared/build/components/FocusBlurHandler';
import { Group } from '@vx/group';
import PropTypes from 'prop-types';
import React from 'react';
import themeColors from '@data-ui/theme/build/color';

import { barSeriesDataShape } from '../utils/propShapes';
import { callOrValue, isDefined } from '../utils/chartUtils';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,
  barWidth: PropTypes.number,
  data: barSeriesDataShape.isRequired,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
};

const defaultProps = {
  barWidth: null,
  fill: themeColors.default,
  fillOpacity: null,
  stroke: '#FFFFFF',
  strokeWidth: 1,
};

const x = d => d.x;
const y = d => d.y;
const noEventsStyles = { pointerEvents: 'none' };

export default class BarSeries extends React.PureComponent {
  render() {
    const {
      barWidth,
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
    } = this.props;

    if (!xScale || !yScale || !barWidth) return null;

    const maxHeight = (yScale.range() || [0])[0];
    const offset = xScale.offset || 0;

    return (
      <Group style={disableMouseEvents ? noEventsStyles : null}>
        {data.map((d, i) => {
          const barHeight = maxHeight - yScale(y(d));
          const color = d.fill || callOrValue(fill, d, i);
          const barX = xScale(x(d)) - offset;

          return (
            isDefined(d.y) && (
              <FocusBlurHandler
                key={`bar-${barX}`}
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
                  x={barX}
                  y={maxHeight - barHeight}
                  width={barWidth}
                  height={barHeight}
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
