/* Controlled, labeled input */
import PropTypes from 'prop-types';
import React from 'react';
import { css, withStyles, withStylesProps } from '../../themes/withStyles';

const propTypes = {
  ...withStylesProps,
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
  styles,
  value,
}) {
  return (
    <div {...(css(styles.container))}>
      <label
        title={label}
        htmlFor={name}
      >
        {label}
      </label>
      <input
        {...(css(styles.input))}
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

export default withStyles(({ unit, font, color }) => ({
  container: {
    width: 300,
    height: 3 * unit,
    paddingBottom: 0.5 * unit,
    paddingTop: 0.5 * unit,
  },

  input: {
    border: `1px solid ${color.mediumGray}`,
    width: '100%',
    height: '100%',
    textAlign: 'inherit',
    ':focus': {
      outline: 'none',
    },
    ...font.small,
  },
}))(LabeledInput);
