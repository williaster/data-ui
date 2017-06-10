import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';

import { nodeShape } from '../propShapes';

const DEFAULT_NODE_WIDTH = 5;

const propTypes = {
  node: nodeShape.isRequired,
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number.isRequired,
  fill: PropTypes.string,
};

const defaultProps = {
  width: DEFAULT_NODE_WIDTH,
  fill: 'magenta',
};

class Node extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      isMousedOver: false,
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onMouseOver() {
    console.log('over', this.props.node.name);
  }

  onMouseOut() {
    console.log('out', this.props.node.name);
  }

  onClick() {
    console.log('click', this.props.node.name);
  }

  render() {
    const {
      node,
      x,
      y,
      width,
      height,
      fill,
    } = this.props;
    return (
      <g
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        <Bar
          x={x}
          y={y}
          width={width}
          height={Math.max(1, height)}
          fill={fill}
          stroke="#fff"
          strokeWidth={1}
          rx={2}
          ry={2}
          vectorEffect="non-scaling-stroke"
        />
        {/* @todo add fonts + check background for text color */}
        {this.state.isMousedOver &&
          <text
            x={x + (width / 2)}
            y={height / 2}
            textAnchor="middle"
            vectorEffect="non-scaling-stroke"
          >
            {node.name}
          </text>}
      </g>
    );
  }
}

Node.width = DEFAULT_NODE_WIDTH;
Node.propTypes = propTypes;
Node.defaultProps = defaultProps;

export default Node;
