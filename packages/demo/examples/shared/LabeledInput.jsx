/* Controlled, labeled input */
import PropTypes from 'prop-types';
import React from 'react';
import { css, withStyles, withStylesPropTypes } from '../../themes/withStyles';

const propTypes = {
  ...withStylesPropTypes,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.any,
};

const defaultProps = {
  disabled: false,
  label: null,
  placeholder: null,
  value: null,
  onKeyDown: null,
};

function LabeledInput({ disabled, label, name, onChange, onKeyDown, placeholder, styles, value }) {
  return (
    <div {...css(styles.container)}>
      {label && (
        <label title={label} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        {...css(styles.input)}
        aria-label={label}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
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
