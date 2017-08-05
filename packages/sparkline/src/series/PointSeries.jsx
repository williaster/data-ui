import PropTypes from 'prop-types';
import React from 'react';

import { GlyphDot } from '@vx/glyph';
import { Group } from '@vx/group';

import defined from '../utils/defined';

export const propTypes = {
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  points: PropTypes.arrayOf(PropTypes.oneOf([
    'all',
    'min',
    'max',
    'first',
    'last',
  ])),
  size: PropTypes.number,
  //renderLabel: PropTypes.func, (d) => node
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // all likely passed by the parent chart
  data: PropTypes.array,
  getX: PropTypes.func,
  getY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  fill: '#fff',
  fillOpacity: 1,
  getX: null,
  getY: null,
  points: ['min', 'max'],
  size: 3,
  stroke: '#008489',
  strokeWidth: 2,
  xScale: null,
  yScale: null,
};

function PointSeries({
  data,
  getX,
  getY,
  fill,
  fillOpacity,
  points,
  size,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getX || !getY || !data.length) return null;

  // @TODO factor into helper
  // pointsToRender = filterPoints({ data, points, yScale, getY });
  const showAll = points.includes('all');
  const showMin = points.includes('min');
  const showMax = points.includes('max');
  const showFirst = points.includes('first');
  const showLast = points.includes('last');
  const [minY, maxY] = yScale.domain(); // @TODO make sure this is not buggy upon animating
  const lastIndex = data.length - 1;

  const dataToRender = data.filter((d, i) => (
    showAll
    || (showFirst && i === 0)
    || (showLast && i === lastIndex)
    || (showMin && Math.abs(getY(d) - minY) < 0.0001)
    || (showMax && Math.abs(getY(d) - maxY) < 0.0001)
  ));

  return (
    <Group>
      {dataToRender.map((d, i) => {
        const cx = xScale(getX(d));
        const cy = yScale(getY(d));
        const key = `${cx}-${cy}-${i}`;
        return defined && (
          <GlyphDot
            key={key}
            cx={cx}
            cy={cy}
            r={size}
            fill={d.fill || fill}
            fillOpacity={d.fillOpacity || fillOpacity}
            stroke={d.stroke || stroke}
            strokeWidth={d.strokeWidth || strokeWidth}
          />
        );
      })}
    </Group>
  );
}

PointSeries.propTypes = propTypes;
PointSeries.defaultProps = defaultProps;
PointSeries.displayName = 'PointSeries';

export default PointSeries;
