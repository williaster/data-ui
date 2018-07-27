import BoxPlot from '@vx/stats/build/boxplot/BoxPlot';
import FocusBlurHandler from '@data-ui/shared/build/components/FocusBlurHandler';
import Group from '@vx/group/build/Group';
import PropTypes from 'prop-types';
import React from 'react';
import themeColors from '@data-ui/theme/build/color';

import { callOrValue, isDefined } from '../utils/chartUtils';
import { boxPlotSeriesDataShape } from '../utils/propShapes';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,
  containerEvents: PropTypes.bool,
  data: boxPlotSeriesDataShape.isRequired,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  horizontal: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  widthRatio: PropTypes.number,
  containerProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  outlierProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  boxProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  minProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  maxProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  medianProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
  containerEvents: true,
  stroke: themeColors.darkGray,
  strokeWidth: 2,
  fill: themeColors.default,
  fillOpacity: 1,
  horizontal: false,
  widthRatio: 1,
  containerProps: null,
  outlierProps: null,
  boxProps: null,
  minProps: null,
  maxProps: null,
  medianProps: null,
};

const MAX_BOX_WIDTH = 50;
const x = d => d.x;
const y = d => d.y;
const min = d => d.min;
const max = d => d.max;
const median = d => d.median;
const firstQuartile = d => d.firstQuartile;
const thirdQuartile = d => d.thirdQuartile;
const outliers = d => d.outliers || [];

export default class BoxPlotSeries extends React.PureComponent {
  render() {
    const {
      containerEvents,
      data,
      fill,
      stroke,
      strokeWidth,
      xScale,
      yScale,
      horizontal,
      widthRatio,
      fillOpacity,
      containerProps,
      outlierProps,
      boxProps,
      minProps,
      maxProps,
      medianProps,
      onMouseMove,
      onMouseLeave,
      disableMouseEvents,
      onClick,
    } = this.props;

    if (!xScale || !yScale) return null;
    const offsetScale = horizontal ? yScale : xScale;
    const offsetValue = horizontal ? y : x;
    const valueScale = horizontal ? xScale : yScale;
    const boxWidth = offsetScale.bandwidth();
    const actualWidth = Math.min(MAX_BOX_WIDTH, boxWidth);
    const offset = (offsetScale.offset || 0) - (boxWidth - actualWidth) / 2;
    const offsetPropName = horizontal ? 'top' : 'left';
    const offsetProp = d => ({
      [offsetPropName]: offsetScale(offsetValue(d)) - offset + ((1 - widthRatio) / 2) * actualWidth,
    });
    const mouseEventProps = (d, i) => ({
      onMouseMove: disableMouseEvents
        ? null
        : onMouseMove &&
          (() => event => {
            onMouseMove({ event, data, datum: d, index: i });
          }),
      onMouseLeave: disableMouseEvents ? null : onMouseLeave && (() => onMouseLeave),
      onClick: disableMouseEvents
        ? null
        : onClick &&
          (() => event => {
            onClick({ event, data, datum: d, index: i });
          }),
    });

    return (
      <Group>
        {data.map((d, i) => {
          const mouseEvents = mouseEventProps(d, i);

          return (
            isDefined(min(d)) && (
              <FocusBlurHandler
                key={offsetValue(d)}
                xlinkHref="#"
                onBlur={disableMouseEvents ? null : onMouseLeave}
                onFocus={
                  disableMouseEvents
                    ? null
                    : event => {
                        onMouseMove({ event, data, datum: d, index: i });
                      }
                }
              >
                <BoxPlot
                  min={min(d)}
                  max={max(d)}
                  {...offsetProp(d)}
                  firstQuartile={firstQuartile(d)}
                  thirdQuartile={thirdQuartile(d)}
                  median={median(d)}
                  boxWidth={actualWidth * widthRatio}
                  outliers={outliers(d)}
                  fill={d.fill || callOrValue(fill, d, i)}
                  stroke={d.stroke || callOrValue(stroke, d, i)}
                  strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
                  fillOpacity={d.fillOpacity || callOrValue(fillOpacity, d, i)}
                  valueScale={valueScale}
                  horizontal={horizontal}
                  container={containerEvents}
                  containerProps={
                    (containerEvents || containerProps || undefined) && {
                      ...containerProps,
                      ...(containerEvents && mouseEvents),
                    }
                  }
                  outlierProps={
                    (!containerEvents || outlierProps || undefined) && {
                      ...outlierProps,
                      ...(!containerEvents && mouseEvents),
                    }
                  }
                  boxProps={
                    (!containerEvents || boxProps || undefined) && {
                      ...boxProps,
                      ...(!containerEvents && mouseEvents),
                    }
                  }
                  minProps={
                    (!containerEvents || minProps || undefined) && {
                      ...minProps,
                      ...(!containerEvents && mouseEvents),
                    }
                  }
                  maxProps={
                    (!containerEvents || maxProps || undefined) && {
                      ...maxProps,
                      ...(!containerEvents && mouseEvents),
                    }
                  }
                  medianProps={
                    (!containerEvents || medianProps || undefined) && {
                      ...medianProps,
                      ...(!containerEvents && mouseEvents),
                    }
                  }
                />
              </FocusBlurHandler>
            )
          );
        })}
      </Group>
    );
  }
}

BoxPlotSeries.propTypes = propTypes;
BoxPlotSeries.defaultProps = defaultProps;
BoxPlotSeries.displayName = 'BoxPlotSeries';
