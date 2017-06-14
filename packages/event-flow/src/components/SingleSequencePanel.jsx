import PropTypes from 'prop-types';
import React from 'react';

import { nodeShape, scaleShape } from '../propShapes';

const propTypes = {
  nodes: PropTypes.arrayOf(nodeShape),
  xScale: scaleShape,
  yScale: scaleShape,
};

const defaultProps = {
  nodes: null,
  xScale: null,
  yScale: null,
};

class SingleSequencePanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { nodes } = this.props;
    return (
      <div
        style={{
          background: '#fff',
          width: '100%',
          height: '100%',
          borderTop: '1px solid #ddd',
          overflowY: 'auto',
          padding: 8,
        }}
      >
        {nodes ? '...' : 'Select a node to view raw sequences'}
      </div>
    );
  }
}

SingleSequencePanel.propTypes = propTypes;
SingleSequencePanel.defaultProps = defaultProps;

export default SingleSequencePanel;
