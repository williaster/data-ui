import React from 'react';
import PropTypes from 'prop-types';
import { BarGroup } from '@vx/shape';

import { barSeriesDataShape } from '../utils/propShapes';
import { scaleTypeToScale } from '../utils/chartUtils';
import { colors } from '../theme';

const propTypes = {
  data: barSeriesDataShape.isRequired,
  groupKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupFills: PropTypes.arrayOf(PropTypes.string),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  groupPadding: PropTypes.number, // see https://github.com/d3/d3-scale#band-scales

  // these will likely be injected by the parent xychart
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
};

const defaultProps = {
  stack: null,
  stackFills: colors.categories,
  groupKeys: null,
  groupFills: colors.categories,
  groupPadding: 0.1,

  fill: colors.default,
  stackBy: null,
  stroke: 'none',
  strokeWidth: 1,
};

const x = d => d.x;

export default function GroupedBarSeries({
  data,
  groupKeys,
  groupFills,
  groupPadding,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale.bandwidth) { // @todo figure this out/be more graceful
    throw new Error("'GroupedBarSeries' requires a 'band' type xScale");
  }
  const maxHeight = (yScale.range() || [0])[0];
  const x1Scale = scaleTypeToScale.band({
    rangeRound: [0, xScale.bandwidth()],
    domain: groupKeys,
    padding: groupPadding,
  });
  const zScale = scaleTypeToScale.ordinal({ range: groupFills, domain: groupKeys });
  return (
    <BarGroup
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
    />
  );
}

GroupedBarSeries.propTypes = propTypes;
GroupedBarSeries.defaultProps = defaultProps;
GroupedBarSeries.displayName = 'GroupedBarSeries';
