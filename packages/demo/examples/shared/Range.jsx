import PropTypes from 'prop-types';
import React from 'react';

import Spacer from './Spacer';

export default function Range({ id, label, min, max, step, value, onChange }) {
  return (
    <Spacer>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
    </Spacer>
  );
}

Range.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

Range.defaultProps = {
  min: -5,
  max: 5,
  step: 1,
};
