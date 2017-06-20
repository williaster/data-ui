import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import React from 'react';

const unit = 8;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },

  flexRow: {
    flexDirection: 'row',
  },

  flexColumn: {
    flexDirection: 'column',
  },

  center: {
    alignItems: 'middle',
    justifyContent: 'center',
  },
});

const propTypes = {
  children: PropTypes.node.isRequired,
  center: PropTypes.bool,
  after: PropTypes.node,
  before: PropTypes.node,
  flexDirection: PropTypes.oneOf(['row', 'column']),
  spaceBetween: PropTypes.number,
};

const defaultProps = {
  before: null,
  after: null,
  flexDirection: 'row',
  center: true,
  spaceBetween: 1,
};

function Labeled({
  after,
  before,
  center,
  flexDirection,
  children,
  spaceBetween,
}) {
  return (
    <div
      className={css(
        flexDirection === 'row' ? styles.flexRow : styles.flexColumn,
        center && styles.center,
      )}
    >
      {before && (
        <div
          style={{
            [flexDirection === 'row' ? 'paddingRight' : 'paddingTop']: spaceBetween * unit,
          }}
        >
          {before}
        </div>
      )}

      <div>
        {children}
      </div>

      {after && (
        <div
          style={{
            [flexDirection === 'row' ? 'paddingLeft' : 'paddingBottom']: spaceBetween * unit,
          }}
        >
          {after}
        </div>
      )}
    </div>
  );
}

Labeled.propTypes = propTypes;
Labeled.defaultProps = defaultProps;

export default Labeled;
