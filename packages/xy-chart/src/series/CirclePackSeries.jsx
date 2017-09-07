import React from 'react';
import PropTypes from 'prop-types';

import PointSeries from './PointSeries';

import computeCirclePack from '../utils/computeCirclePack';

const propTypes = {
  ...PointSeries.propTypes,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      // x should be anything sortable
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.instanceOf(Date)]),
      size: PropTypes.number,
    }),
  ).isRequired,
};

const defaultProps = {
  ...PointSeries.defaultProps,
};

// eslint-disable-next-line react/prefer-stateless-function
class CirclePackSeries extends React.PureComponent {
  render() {
    const { data: rawData, xScale } = this.props;
    const data = computeCirclePack(rawData, xScale);
    return (
      <PointSeries
        {...this.props}
        data={data}
      />
    );
  }
}

CirclePackSeries.propTypes = propTypes;
CirclePackSeries.defaultProps = defaultProps;
CirclePackSeries.displayName = 'CirclePackSeries';

export default CirclePackSeries;
