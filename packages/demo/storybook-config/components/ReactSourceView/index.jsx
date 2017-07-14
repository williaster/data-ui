import PropTypes from 'prop-types';
import React from 'react';

import { css, withStyles, withStylesPropTypes } from '../../../themes/withStyles';
import Node from './Node';

const propTypes = {
  ...withStylesPropTypes,
  children: PropTypes.node.isRequired,
  useHOC: PropTypes.bool.isRequired,
};

function SourceView({ children, styles, useHOC }) {
  return (
    <div>
      <h4>Story Source</h4>
      <pre {...css(styles.code)}>
        {React.Children.map(children, (root, idx) => (
          <Node key={idx} depth={0} node={root} useHOC={useHOC} />
        ))}
      </pre>
    </div>
  );
}

SourceView.propTypes = propTypes;

export default withStyles(({ unit, color }) => ({
  code: {
    backgroundColor: color.grays[0],
    color: color.grays[6],
    padding: 2 * unit,
    margin: `${3 * unit} 0`,
    whiteSpace: 'pre-wrap',
  },
}))(SourceView);
