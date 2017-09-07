import React from 'react';
import PropTypes from 'prop-types';

import PointSeries, {
  propTypes as pointSeriesPropTypes,
  defaultProps as pointSeriesDefaultProps,
} from './PointSeries';

import computeCirclePack from '../utils/computeCirclePack';

const propTypes = {
  ...pointSeriesPropTypes,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      // x should be anything sortable
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.instanceOf(Date)]),
      size: PropTypes.number,
    }),
  ).isRequired,
};

const defaultProps = {
  ...pointSeriesDefaultProps,
  size: d => d.size || 4,
};

// eslint-disable-next-line react/prefer-stateless-function
class CirclePackSeries extends React.PureComponent {
  render() {
    const { data: rawData, xScale, size } = this.props;
    const data = computeCirclePack(rawData, xScale, size);
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
