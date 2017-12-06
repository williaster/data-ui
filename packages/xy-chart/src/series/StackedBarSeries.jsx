import React from 'react';
import PropTypes from 'prop-types';

import BarStack from '@vx/shape/build/shapes/BarStack';
import color from '@data-ui/theme/build/color';

import { stackedBarSeriesDataShape } from '../utils/propShapes';
import { scaleTypeToScale } from '../utils/chartUtils';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,
  data: stackedBarSeriesDataShape.isRequired,
  stackKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  stackFills: PropTypes.arrayOf(PropTypes.string),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
};

const defaultProps = {
  stackFills: color.categories,
  stroke: '#FFFFFF',
  strokeWidth: 1,
};

const x = d => d.x;
const noEventsStyles = { pointerEvents: 'none' };

export default class StackedBarSeries extends React.PureComponent {
  render() {
    const {
      data,
      disableMouseEvents,
      stackKeys,
      stackFills,
      stroke,
      strokeWidth,
      xScale,
      yScale,
      onClick,
      onMouseMove,
      onMouseLeave,
    } = this.props;
    if (!xScale || !yScale) return null;
    if (!xScale.bandwidth) { // @todo figure this out/be more graceful
      throw new Error("'StackedBarSeries' requires a 'band' type xScale");
    }
    const maxHeight = (yScale.range() || [0])[0];
    const zScale = scaleTypeToScale.ordinal({ range: stackFills, domain: stackKeys });
    return (
      <BarStack
        style={disableMouseEvents ? noEventsStyles : null}
        data={data}
        keys={stackKeys}
        height={maxHeight}
        x={x}
        xScale={xScale}
        yScale={yScale}
        zScale={zScale}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onClick={disableMouseEvents ? null : onMouseMove && (d => (event) => {
          const { data: datum, key: seriesKey } = d;
          onClick({ event, data, datum, seriesKey, color: zScale(seriesKey) });
        })}
        onMouseMove={disableMouseEvents ? null : onMouseMove && (d => (event) => {
          const { data: datum, key } = d;
          onMouseMove({ event, data, datum, seriesKey: key, color: zScale(key) });
        })}
        onMouseLeave={disableMouseEvents ? null : onMouseLeave && (() => onMouseLeave)}
      />
    );
  }
}

StackedBarSeries.propTypes = propTypes;
StackedBarSeries.defaultProps = defaultProps;
StackedBarSeries.displayName = 'StackedBarSeries';
