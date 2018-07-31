import React from 'react';
import PropTypes from 'prop-types';

import { BarGroup } from '@vx/shape';
import { color } from '@data-ui/theme';

import { groupedBarSeriesDataShape } from '../utils/propShapes';
import { scaleTypeToScale } from '../utils/getScaleForAccessor';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,
  data: groupedBarSeriesDataShape.isRequired,
  groupKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupFills: PropTypes.arrayOf(PropTypes.string),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  groupPadding: PropTypes.number, // see https://github.com/d3/d3-scale#band-scales
};

const defaultProps = {
  groupFills: color.categories,
  groupPadding: 0.1,
  stroke: 'none',
  strokeWidth: 1,
};

const x = d => d.x;
const noEventsStyles = { pointerEvents: 'none' };

export default class GroupedBarSeries extends React.PureComponent {
  render() {
    const {
      data,
      disableMouseEvents,
      groupKeys,
      groupFills,
      groupPadding,
      stroke,
      strokeWidth,
      xScale,
      yScale,
      onClick,
      onMouseMove,
      onMouseLeave,
    } = this.props;

    if (!xScale || !yScale) return null;
    if (!xScale.bandwidth) {
      // @todo figure this out/be more graceful
      throw new Error("'GroupedBarSeries' requires a 'band' type xScale");
    }
    const maxHeight = (yScale.range() || [0])[0];
    const x1Scale = scaleTypeToScale.band({
      rangeRound: [0, xScale.bandwidth()],
      domain: groupKeys,
      padding: groupPadding,
    });
    const zScale = scaleTypeToScale.ordinal({
      range: groupFills,
      domain: groupKeys,
    });

    return (
      <BarGroup
        style={disableMouseEvents ? noEventsStyles : null}
        data={data}
        keys={groupKeys}
        height={maxHeight}
        x0={x}
        x0Scale={xScale}
        x1Scale={x1Scale}
        yScale={yScale}
        zScale={zScale}
        rx={2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onClick={
          disableMouseEvents
            ? null
            : onClick &&
              (d => event => {
                const { key: seriesKey, data: datum } = d;
                onClick({
                  event,
                  data,
                  datum,
                  seriesKey,
                  color: zScale(seriesKey),
                });
              })
        }
        onMouseMove={
          disableMouseEvents
            ? null
            : onMouseMove &&
              (d => event => {
                const { key, data: datum } = d;
                onMouseMove({
                  event,
                  data,
                  datum,
                  seriesKey: key,
                  color: zScale(key),
                });
              })
        }
        onMouseLeave={disableMouseEvents ? null : onMouseLeave && (() => onMouseLeave)}
      />
    );
  }
}

GroupedBarSeries.propTypes = propTypes;
GroupedBarSeries.defaultProps = defaultProps;
GroupedBarSeries.displayName = 'GroupedBarSeries';
