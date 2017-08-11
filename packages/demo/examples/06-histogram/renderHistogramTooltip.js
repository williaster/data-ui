import React from 'react';
import PropTypes from 'prop-types';

export default function RenderTooltip({ datum, color }) {
  const { bin, bin0, bin1, count, cumulative, density } = datum;
  return (
    <div>
      <div>
        <strong style={{ color }}>
          {typeof bin !== 'undefined' ? bin : `${bin0} to ${bin1}`}
        </strong>
      </div>
      <br />
      <div>
        <strong>count </strong>{count}
      </div>
      <div>
        <strong>cumulative </strong>{cumulative}
      </div>
      <div>
        <strong>percentage </strong>
        {(density * 100).toFixed(2)}%
      </div>
    </div>
  );
}

RenderTooltip.propTypes = {
  datum: PropTypes.object.isRequired, // eslint-disable-line
  color: PropTypes.string,
};

RenderTooltip.defaultProps = {
  color: null,
};
