import React from 'react';
import PropTypes from 'prop-types';

import Group from '@vx/group/build/Group';
import Stack from '@vx/shape/build/shapes/Stack';
import color from '@data-ui/theme/build/color';

import interpolatorLookup from '../utils/interpolatorLookup';
import { callOrValue, isDefined } from '../utils/chartUtils';
import findClosestDatum from '../utils/findClosestDatum';
import { lineSeriesDataShape, interpolationShape } from '../utils/propShapes';

const propTypes = {
  data: lineSeriesDataShape.isRequired,
  disableMouseEvents: PropTypes.bool,
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  interpolation: interpolationShape,
  stackKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  stackFills: PropTypes.arrayOf(PropTypes.string),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  onClick: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  // these will likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

const defaultProps = {
  disableMouseEvents: false,
  fill: color.default,
  fillOpacity: 0.7,
  interpolation: 'monotoneX',
  stackFills: color.categories,
  stroke: '#fff',
  strokeWidth: 1,
  xScale: null,
  yScale: null,
  onClick: null,
  onMouseMove: null,
  onMouseLeave: null,
};

const x = d => d.x;
const y0 = d => d[0];
const y1 = d => d[1];
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
          onClick={disableMouseEvents ? null : onClick && (({ series, index }) => (event) => {
            const datum = findClosestDatum({ data: series, getX: d => x(d.data), event, xScale });
            onClick({
              event,
              data,
              seriesKey: series.key,
              datum: datum && datum.data,
              color: stackFills[index],
            });
          })}
          onMouseMove={disableMouseEvents ? null : onMouseMove &&
            (({ series, index }) => (event) => {
              const datum = findClosestDatum({ data: series, getX: d => x(d.data), event, xScale });
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
