import PropTypes from 'prop-types';
import React from 'react';

import GlyphDot from '@vx/glyph/build/glyphs/Dot';
import Group from '@vx/group/build/Group';
import color from '@data-ui/theme/build/color';
import svgLabel from '@data-ui/theme/build/svgLabel';

import Label from '../annotation/Label';
import callOrValue from '../utils/callOrValue';
import defined from '../utils/defined';
import positionLabel from '../utils/positionLabel';

export const propTypes = {
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  LabelComponent: PropTypes.element,
  labelOffset: PropTypes.number,
  labelPosition: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf(['auto', 'top', 'right', 'bottom', 'left']),
  ]),
  points: PropTypes.arrayOf(PropTypes.oneOf([
    'all',
    'min',
    'max',
    'first',
    'last',
  ])),
  size: PropTypes.number,
  renderLabel: PropTypes.func, // (d, i) => node
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
  LabelComponent: <Label {...svgLabel.baseTickLabel} stroke="#fff" />,
  labelOffset: 12,
  labelPosition: 'auto',
  getX: null,
  getY: null,
  points: ['min', 'max'],
  renderLabel: null,
  size: 3,
  stroke: color.default,
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
  LabelComponent,
  labelOffset,
  labelPosition,
  points,
  renderLabel,
  size,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) {
  if (!xScale || !yScale || !getX || !getY || !data.length) return null;

  const showAll = points.includes('all');
  const showMin = points.includes('min');
  const showMax = points.includes('max');
  const showFirst = points.includes('first');
  const showLast = points.includes('last');
  const [minY, maxY] = yScale.domain();
  const lastIndex = data.length - 1;

  return (
    <Group>
      {data.map((d, i) => {
        if (
          showAll
          || (showFirst && i === 0)
          || (showLast && i === lastIndex)
          || (showMin && Math.abs(getY(d) - minY) < 0.00001)
          || (showMax && Math.abs(getY(d) - maxY) < 0.00001)
        ) {
          const cx = xScale(getX(d));
          const cy = yScale(getY(d));
          const key = `${cx}-${cy}-${i}`;

          const label = renderLabel && renderLabel(getY(d), i);
          const prevCy = data[i - 1] ? yScale(getY(data[i - 1])) : null;
          const nextCy = data[i + 1] ? yScale(getY(data[i + 1])) : null;

          // position label above a point if either of the surrounding points are lower
          const autoLabelPosition =
            (prevCy !== null && prevCy > cy) || (nextCy !== null && nextCy > cy)
            ? 'top' : 'bottom';

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
            >
              {label &&
                React.cloneElement(LabelComponent, {
                  x: cx,
                  y: cy,
                  ...positionLabel(
                    labelPosition === 'auto' ? autoLabelPosition : callOrValue(labelPosition, d, i),
                    labelOffset,
                  ),
                  label,
                })}
            </GlyphDot>
          );
        }
        return null;
      })}
    </Group>
  );
}

PointSeries.propTypes = propTypes;
PointSeries.defaultProps = defaultProps;
PointSeries.displayName = 'PointSeries';

export default PointSeries;
