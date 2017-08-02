import PropTypes from 'prop-types';
import React from 'react';

import Spacer from './Spacer';

export default function Checkbox({ id, label, checked, onChange }) {
  return (
    <Spacer>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label
        style={{ textTransform: 'capitalize' }}
        htmlFor={id}
      >
        {label}
      </label>
    </Spacer>
  );
}

Checkbox.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
