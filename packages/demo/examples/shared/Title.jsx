import PropTypes from 'prop-types';
import React from 'react';
import { unit, font } from '@data-ui/theme';

const spacerStyles = {
  ...font.large,
  paddingBottom: 0.5 * unit,
};

export default function Title({ children }) {
  return <div style={spacerStyles}>{children}</div>;
}

Title.propTypes = {
  children: PropTypes.node.isRequired,
};
