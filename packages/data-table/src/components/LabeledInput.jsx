/* Controlled, labeled input */
import React, { PropTypes } from 'react';

const propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any,
};

const defaultProps = {
  disabled: false,
  placeholder: null,
  value: null,
};

function LabeledInput({
  disabled,
  label,
  name,
  onChange,
  placeholder,
  value,
}) {
  return (
    <div>
      <label
        title={label}
        htmlFor={name}
      >
        {label}
      </label>
      <input
        aria-label={label}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  );
}

LabeledInput.propTypes = propTypes;
LabeledInput.defaultProps = defaultProps;

export default LabeledInput;
