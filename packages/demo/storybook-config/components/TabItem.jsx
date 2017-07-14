import { Button } from '@data-ui/forms';
import PropTypes from 'prop-types';
import React from 'react';

import { css, withStyles, withStylesPropTypes } from '../../themes/withStyles';

function TabItem({ children, active, disabled, onPress, styles }) {
  return (
    <span {...css(styles.tabItem, active && styles.active)}>
      <Button onClick={onPress} disabled={disabled} noBorder>
        {children}
      </Button>
    </span>
  );
}

TabItem.propTypes = {
  ...withStylesPropTypes,
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TabItem.defaultProps = {
  active: false,
  disabled: false,
};

export default withStyles(({ color }) => ({
  tabItem: {
    marginBottom: -2,
  },

  active: {
    borderBottom: `2px solid ${color.darkGray}`,
    display: 'inline-block',
    pointerEvents: 'none',
    marginBottom: -2,
  },
}))(TabItem);
