import PropTypes from 'prop-types';
import React from 'react';

import Spacer from '../shared/Spacer';
import Title from '../shared/Title';

export default function Example({ title, children }) {
  return (
    <Spacer flexDirection="column">
      {title && <Title>{title}</Title>}
      {children}
    </Spacer>
  );
}

Example.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
};

Example.defaultProps = {
  title: null,
};
