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
  parentRef: PropTypes.object,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  children: PropTypes.node,
};

const defaultProps = {
  parentRef: null,
  children: null,
};

// @TODO detect actual size of tooltip for overflow
//  this should prob live within a @vx tooltip
//      could do with an initial invisible render w opacity to 0, then detect size and render child
//      so child isn't rendered without height?
function Tooltip({
  parentRef,
  x,
  y,
  children,
}) {
  let left = x + 50;
  let top = y + 60;

  if (parentRef) {
    const rect = parentRef.getBoundingClientRect();
    const parentWidth = rect.width;
    const parentHeight = rect.height;
    left = x + WIDTH > parentWidth ? (x - WIDTH) + 30 : x + 50;
    top = y + 170 > parentHeight ? (y - 110) : y + 60;
  }

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
