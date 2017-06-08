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
  fillScale: PropTypes.func.isRequired,
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  fill: PropTypes.func.isRequired,
};

const defaultProps = {
};

class GraphLayout extends React.PureComponent {
  render() {
    const {
      x,
      y,
      fill,
      graph,
      xScale,
      yScale,
      fillScale,
    } = this.props;

    return (
      <Group>
        {graph.links.map(link => (
          <Link
            key={`${fill(link.source)}-${fill(link.target)}`}
            link={link}
            xScale={xScale}
            yScale={yScale}
            x={x}
            y={y}
          />
        ))}
        {Object.keys(graph.nodes).map(id => (
          <Node
            key={id}
            node={graph.nodes[id]}
            xScale={xScale}
            yScale={yScale}
            fillScale={fillScale}
            x={x}
            y={y}
            fill={fill}
            label={
              <text
                key={id}
                dx="0.25em"
                dy="-0.5em"
                fill="#484848"
                stroke="none"
              >
                {graph.nodes[id].name}
              </text>
            }
          />
        ))}
      </Group>
    );
  }
}

GraphLayout.propTypes = propTypes;
GraphLayout.defaultProps = defaultProps;

export default GraphLayout;
