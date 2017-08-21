import PropTypes from 'prop-types';
import React from 'react';
import { unit, font } from '@data-ui/theme';

const spacerStyles = {
  ...font.regular,
  display: 'flex',
  alignItems: 'flex-start',
};

export default function Spacer({ children, top, right, bottom, left, ...rest }) {
  return (
    <div
      style={{
        ...spacerStyles,
        marginTop: top * unit,
        marginRight: right * unit,
        marginBottom: bottom * unit,
        marginLeft: left * unit,
        ...rest,
      }}
    >
      {children}
    </div>
  );
}

Spacer.propTypes = {
  children: PropTypes.node.isRequired,
  top: PropTypes.number,
  right: PropTypes.number,
  bottom: PropTypes.number,
  left: PropTypes.number,
  flexDirection: PropTypes.oneOf(['row', 'column']),
};

Spacer.defaultProps = {
  top: 0,
  right: 0,
  bottom: 1,
  left: 0,
  flexDirection: 'row',
};
