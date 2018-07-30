import React from 'react';
import PropTypes from 'prop-types';

import { Group } from '@vx/group';
import { Stack } from '@vx/shape';
import { colors } from '@data-ui/theme';

import interpolatorLookup from '../utils/interpolatorLookup';
import { callOrValue, isDefined } from '../utils/chartUtils';
import findClosestDatum from '../utils/findClosestDatum';
import { lineSeriesDataShape, interpolationShape } from '../utils/propShapes';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,
  data: lineSeriesDataShape.isRequired,
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  interpolation: interpolationShape,
  stackKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  stackFills: PropTypes.arrayOf(PropTypes.string),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
};

const defaultProps = {
  fillOpacity: 0.7,
  interpolation: 'monotoneX',
  stackFills: colors.categories,
  stroke: '#fff',
  strokeWidth: 1,
};

const x = d => d && d.x;
const y0 = d => d && d[0];
const y1 = d => d && d[1];
const defined = d => isDefined(d[0]) && isDefined(d[1]);
const noEventsStyles = { pointerEvents: 'none' };

export default class StackedAreaSeries extends React.PureComponent {
  render() {
    const {
      data,
      disableMouseEvents,
      xScale,
      yScale,
      stackKeys,
      stackFills,
      fillOpacity,
      stroke,
      strokeWidth,
      interpolation,
      onClick,
      onMouseMove,
      onMouseLeave,
    } = this.props;
    if (!xScale || !yScale) return null;

    return (
      <Group style={disableMouseEvents ? noEventsStyles : null}>
        <Stack
          data={data}
          x={d => xScale(x(d.data))}
          y0={d => yScale(y0(d))}
          y1={d => yScale(y1(d))}
          keys={stackKeys}
          fill={({ index }) => stackFills[index]}
          fillOpacity={({ index, datum }) => callOrValue(fillOpacity, { datum, index })}
          stroke={({ datum, index }) => callOrValue(stroke, { datum, index })}
          strokeWidth={({ datum, index }) => callOrValue(strokeWidth, { datum, index })}
          curve={interpolatorLookup[interpolation] || interpolatorLookup.monotoneX}
          defined={defined}
          onClick={
            disableMouseEvents
              ? null
              : onClick &&
                (({ series, index }) => event => {
                  const datum = findClosestDatum({
                    data: series,
                    getX: d => x(d.data),
                    event,
                    xScale,
                  });
                  onClick({
                    event,
                    data,
                    seriesKey: series.key,
                    datum: datum && datum.data,
                    color: stackFills[index],
                  });
                })
          }
          onMouseMove={
            disableMouseEvents
              ? null
              : onMouseMove &&
                (({ series, index }) => event => {
                  const datum = findClosestDatum({
                    data: series,
                    getX: d => x(d.data),
                    event,
                    xScale,
                  });
                  onMouseMove({
                    event,
                    data,
                    seriesKey: series.key,
                    datum: datum && datum.data,
                    color: stackFills[index],
                  });
                })
          }
          onMouseLeave={disableMouseEvents ? null : () => onMouseLeave}
        />
      </Group>
    );
  }
}

StackedAreaSeries.propTypes = propTypes;
StackedAreaSeries.defaultProps = defaultProps;
StackedAreaSeries.displayName = 'StackedAreaSeries';
