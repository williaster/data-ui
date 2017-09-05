import React from 'react';
import PropTypes from 'prop-types';

import PointSeries from './PointSeries';

import computeCirclePack from '../utils/computeCirclePack';

const propTypes = {
  ...PointSeries.propTypes,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.instanceOf(Date)]),
      size: PropTypes.number,
      importance: PropTypes.number,
    }),
  ).isRequired,
};

const defaultProps = {
  ...PointSeries.defaultProps,
};

function CirclePackSeries(props) {
  const { xScale, data, yScale } = props;
  const { data: modifiedData,
          xScale: modifiedXScale,
          yScale: modifiedYScale } = computeCirclePack(data, xScale, yScale);
  return (
    <PointSeries
      {...props}
      data={modifiedData}
      xScale={modifiedXScale}
      yScale={modifiedYScale}
    />
  );
}

CirclePackSeries.propTypes = propTypes;
CirclePackSeries.defaultProps = defaultProps;
CirclePackSeries.displayName = 'CirclePackSeries';

export default CirclePackSeries;
