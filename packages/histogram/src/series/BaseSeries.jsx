import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  rawData: PropTypes.array,
  binnedData: PropTypes.array,
};

const defaultProps = {
  rawData: null,
  binnedData: null,
};

class BaseSeries extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return null;
  }
}

BaseSeries.propTypes = propTypes;
BaseSeries.defaultProps = defaultProps;
BaseSeries.displayName = 'BaseSeries';

export default BaseSeries;
