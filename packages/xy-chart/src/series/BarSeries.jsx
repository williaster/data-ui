import { Bar } from '@vx/shape';
import { FocusBlurHandler } from '@data-ui/shared';
import { Group } from '@vx/group';
import { Text } from '@vx/text';
import PropTypes from 'prop-types';
import React from 'react';
import { color as themeColors, svgLabel } from '@data-ui/theme';

import { barSeriesDataShape } from '../utils/propShapes';
import { callOrValue, isDefined } from '../utils/chartUtils';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const { baseLabel } = svgLabel;

export const defaultLabelProps = {
  ...baseLabel,
  pointerEvents: 'none',
  stroke: '#fff',
  strokeWidth: 2,
  paintOrder: 'stroke',
  fontSize: 12,
};

const propTypes = {
  ...sharedSeriesProps,
  data: barSeriesDataShape.isRequired,
  defaultLabelProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  renderLabel: PropTypes.func,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  horizontal: PropTypes.bool,
};

const defaultProps = {
  defaultLabelProps,
  fill: themeColors.default,
  fillOpacity: null,
  /* eslint-disable react/prop-types */
  renderLabel: ({ datum, labelProps }) =>
    datum.label ? <Text {...labelProps}>{datum.label}</Text> : null,
  /* eslint-enable react/prop-types */
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
      defaultLabelProps: labelProps,
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
      renderLabel,
      horizontal,
    } = this.props;
    if (!xScale || !yScale) return null;
    const valueScale = horizontal ? xScale : yScale;
    const categoryScale = horizontal ? yScale : xScale;
    const barWidth =
      categoryScale.barWidth || (categoryScale.bandwidth && categoryScale.bandwidth()) || 0;
    const valueField = horizontal ? x : y;
    const categoryField = horizontal ? y : x;

    const zeroPosition = valueScale(0);
    const categoryOffset = categoryScale.offset || 0;
    const Labels = []; // Labels on top

    return (
      <Group style={disableMouseEvents ? noEventsStyles : null}>
        {data.map((d, i) => {
          const barPosition = categoryScale(categoryField(d)) - categoryOffset;
          const barLength = horizontal
            ? valueScale(valueField(d)) - zeroPosition
            : valueScale(valueField(d)) - zeroPosition;

          const color = d.fill || callOrValue(fill, d, i);
          const key = `bar-${barPosition}`;

          if (renderLabel) {
            const Label = renderLabel({
              datum: d,
              index: i,
              labelProps: {
                key,
                ...labelProps,
                x: horizontal ? zeroPosition + Math.abs(barLength) : barPosition + barWidth / 2,
                y: horizontal ? barPosition + barWidth / 2 : zeroPosition + Math.min(0, barLength),
                dx: horizontal ? '0.5em' : 0,
                dy: horizontal ? 0 : '-0.74em',
                textAnchor: horizontal ? 'start' : 'middle',
                verticalAnchor: horizontal ? 'middle' : 'end',
                width: horizontal ? null : barWidth,
              },
            });

            if (Label) Labels.push(Label);
          }

          return (
            isDefined(horizontal ? d.x : d.y) && (
              <FocusBlurHandler
                key={key}
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
                  x={horizontal ? zeroPosition + Math.min(0, barLength) : barPosition}
                  y={horizontal ? barPosition : zeroPosition + Math.min(0, barLength)}
                  width={horizontal ? Math.abs(barLength) : barWidth}
                  height={horizontal ? barWidth : Math.abs(barLength)}
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
        {Labels.map(Label => Label)}
      </Group>
    );
  }
}

BarSeries.propTypes = propTypes;
BarSeries.defaultProps = defaultProps;
BarSeries.displayName = 'BarSeries';
