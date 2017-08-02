import PropTypes from 'prop-types';
import React from 'react';
import { unit, font } from '@data-ui/theme';

const spacerStyles = {
  ...font.regular,
  paddingRight: unit,
  display: 'flex',
  alignItems: 'flex-start',
};

export default function Spacer({ children }) {
  return <div style={spacerStyles}>{children}</div>;
}

Spacer.propTypes = {
  children: PropTypes.node.isRequired,
};
