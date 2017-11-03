import PropTypes from 'prop-types';
import React from 'react';
import { quantile } from 'd3-array';

import Bar from '@vx/shape/build/shapes/Bar';
import color from '@data-ui/theme/build/color';

export const propTypes = {
  band: PropTypes.oneOfType([
    PropTypes.shape({
      from: PropTypes.shape({ // @TODO check that it's a length of 2
        x: PropTypes.number,
        y: PropTypes.number,
      }),
      to: PropTypes.shape({ // @TODO check that it's a length of 2
        x: PropTypes.number,
        y: PropTypes.number,
      }),
    }),
    PropTypes.oneOf(['innerquartiles']),
  ]),
  fill: PropTypes.string,
  fillOpacity: PropTypes.number,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,

  // all likely passed by the parent chart
  data: PropTypes.array,
  getY: PropTypes.func,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
};

export const defaultProps = {
  data: [],
  getY: null,
  band: 'innerquartiles',
  fill: color.lightGray,
  fillOpacity: 0.5,
  stroke: 'transparent',
  strokeWidth: 0,
  xScale: null,
  yScale: null,
};

class BandLine extends React.PureComponent {
  render() {
    const {
      band,
      data,
      fill,
      fillOpacity,
      getY,
      stroke,
      strokeWidth,
      xScale,
      yScale,
    } = this.props;
    if (!xScale || !yScale || !getY || !data.length) return null;

    const [x0, x1] = xScale.range();
    const [y1, y0] = yScale.range();

    let x = 0;
    let y = 0;
    let width = 0;
    let height = 0;
    if (band === 'innerquartiles') {
      const sortedData = [...data].sort((a, b) => parseFloat(getY(a)) - parseFloat(getY(b)));
      const lowerQuartile = yScale(quantile(sortedData, 0.25, getY));
      const upperQuartile = yScale(quantile(sortedData, 0.75, getY));

      y = Math.min(lowerQuartile, upperQuartile);
      height = Math.abs(upperQuartile - lowerQuartile);
      x = x0;
      width = x1 - x0;
    } else {
      // input points are assumed to be values so we must scale them
      const yFrom = typeof band.from.y === 'undefined' ? y0 : yScale(band.from.y);
      const yTo = typeof band.to.y === 'undefined' ? y1 : yScale(band.to.y);

      y = Math.min(yFrom, yTo);
      height = Math.abs(yFrom - yTo);
      x = typeof band.from.x === 'undefined' ? x0 : xScale(band.from.x);
      width = (typeof band.to.x === 'undefined' ? x1 : xScale(band.to.x)) - x;
    }

    return (
      <Bar
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
}

BandLine.propTypes = propTypes;
BandLine.defaultProps = defaultProps;
BandLine.displayName = 'BandLine';

export default BandLine;
