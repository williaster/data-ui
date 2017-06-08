import { Group } from '@vx/group';
import React from 'react';
import PropTypes from 'prop-types';

import { graphShape } from '../propShapes';

import Node from './Node';
import Link from './Link';

const propTypes = {
  graph: graphShape.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  x: PropTypes.func,
  y: PropTypes.func,
  fillScale: PropTypes.func.isRequired,
};

const defaultProps = {
  //@todo map type to accessor
  x: d => d.ELAPSED_MS_ROOT,
  y: d => d.EVENT_COUNT,
};

class GraphLayout extends React.PureComponent {
  render() {
    const {
      x,
      y,
      graph,
      xScale,
      yScale,
      fillScale,
    } = this.props;

    return (
      <Group>
        {Object.keys(graph.nodes).map(id => (
          <text
            key={id}
            x={xScale(x(graph.nodes[id]))}
            y={yScale(y(graph.nodes[id]))}
            dy="0.25em"
            fill={fillScale(graph.nodes[id].name)}
            stroke="none"
          >
            {graph.nodes[id].name}
          </text>
        ))}
      </Group>
    );
  }
}

GraphLayout.propTypes = propTypes;
GraphLayout.defaultProps = defaultProps;

export default GraphLayout;
