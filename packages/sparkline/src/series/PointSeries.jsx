import PropTypes from 'prop-types';
import React from 'react';
import { extent } from 'd3-array';

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
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  points: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number, // index
      PropTypes.oneOf([
        'all',
        'min',
        'max',
        'first',
        'last',
      ]),
    ]),
  ),
  size: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
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
  fill: color.default,
  fillOpacity: 1,
  LabelComponent: <Label {...svgLabel.baseTickLabel} stroke="#fff" />,
  labelOffset: 12,
  labelPosition: 'auto',
  onMouseMove: null,
  onMouseLeave: null,
  getX: null,
  getY: null,
  points: ['min', 'max'],
  renderLabel: null,
  size: 4,
  stroke: '#fff',
  strokeWidth: 2,
  xScale: null,
  yScale: null,
};

class PointSeries extends React.Component {
  // we define a custom handler because the points prop may be impractible to cache
  shouldComponentUpdate(nextProps) {
    const nonPointsAreEqual = Object.keys(propTypes).every(
      prop => prop === 'points' || this.props[prop] === nextProps[prop],
    );

    const pointsAreEqual =
      nextProps.points.length === this.props.points.length
      && nextProps.points.every(point => this.props.points.indexOf(point) > -1);

    return !(pointsAreEqual && nonPointsAreEqual);
  }

  render() {
    const {
      data,
      getX,
      getY,
      fill,
      fillOpacity,
      LabelComponent,
      labelOffset,
      labelPosition,
      onMouseMove,
      onMouseLeave,
      points,
      renderLabel,
      size,
      stroke,
      strokeWidth,
      xScale,
      yScale,
    } = this.props;
    if (!xScale || !yScale || !getX || !getY || !data.length) return null;

    const showAll = points.includes('all');
    const showMin = points.includes('min');
    const showMax = points.includes('max');
    const showFirst = points.includes('first');
    const showLast = points.includes('last');
    const [minY, maxY] = extent(data, getY);
    const lastIndex = data.length - 1;

    return (
      <Group>
        {data.map((d, i) => {
          if (
            points.indexOf(i) > -1
            || showAll
            || (showFirst && i === 0)
            || (showLast && i === lastIndex)
            || (showMin && Math.abs(getY(d) - minY) < 0.00001)
            || (showMax && Math.abs(getY(d) - maxY) < 0.00001)
          ) {
            const yVal = getY(d);
            const cx = xScale(getX(d));
            const cy = yScale(yVal);
            const key = `${cx}-${cy}-${i}`;

            const label = renderLabel && renderLabel(yVal, i);
            const prevCy = data[i - 1] ? yScale(getY(data[i - 1])) : null;
            const nextCy = data[i + 1] ? yScale(getY(data[i + 1])) : null;
            const fillValue = callOrValue(d.fill || fill, yVal, i);

            // position label above a point if either of the surrounding points are lower
            const autoLabelPosition =
              (prevCy !== null && prevCy > cy) || (nextCy !== null && nextCy > cy)
              ? 'top' : 'bottom';

            return defined && (
              <GlyphDot
                key={key}
                cx={cx}
                cy={cy}
                r={callOrValue(d.size || size, yVal, i)}
                fill={fillValue}
                fillOpacity={callOrValue(d.fillOpacity || fillOpacity, yVal, i)}
                stroke={callOrValue(d.stroke || stroke, yVal, i)}
                strokeWidth={callOrValue(d.strokeWidth || strokeWidth, yVal, i)}
                onMouseMove={onMouseMove && ((event) => {
                  onMouseMove({ event, data, datum: d, index: i, color: fillValue });
                })}
                onMouseLeave={onMouseLeave}
              >
                {label &&
                  React.cloneElement(LabelComponent, {
                    x: cx,
                    y: cy,
                    ...positionLabel(
                      labelPosition === 'auto'
                        ? autoLabelPosition
                        : callOrValue(labelPosition, yVal, i),
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
}

PointSeries.propTypes = propTypes;
PointSeries.defaultProps = defaultProps;
PointSeries.displayName = 'PointSeries';

export default PointSeries;
