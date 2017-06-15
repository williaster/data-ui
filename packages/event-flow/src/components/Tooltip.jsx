import { css, StyleSheet } from 'aphrodite';
import React from 'react';
import PropTypes from 'prop-types';

const WIDTH = 200;

const styles = StyleSheet.create({
  tooltip: {
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 100,
    background: 'white',
    border: '1px solid #eaeaea',
    padding: 8,
    borderRadius: 4,
    fontFamily: 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif',
    fontSize: 12,
    width: WIDTH,
  },
});

const propTypes = {
  parentRef: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

function Tooltip({
  parentRef,
  x,
  y,
  children,
}) {
  const rect = parentRef.getBoundingClientRect();
  const parentWidth = rect.width;
  const parentHeight = rect.height;
  const left = x + WIDTH > parentWidth ? (x - WIDTH) + 30 : x + 50;
  const top = y + 170 > parentHeight ? (y - 110) : y + 60;

  return (
    <div
      className={css(styles.tooltip)}
      style={{ top, left }}
    >
      {children}
    </div>
  );
}

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;

export default Tooltip;
