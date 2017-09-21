/* eslint class-methods-use-this: 0, react/no-unused-prop-types: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import Graph from '../graph/Graph';
import { themeShape } from '../utils/propShapes';
import WithTooltip, { withTooltipPropTypes } from '../enhancer/WithTooltip';
import Node from './Node';
import Link from './Link';
import layout from '../layout/atlasForce';

export const propTypes = {
  ...withTooltipPropTypes,
  ariaLabel: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
  }).isRequired,
  layout: PropTypes.string,
  theme: themeShape,
  renderTooltip: PropTypes.func,
  animated: PropTypes.boolean,
};

const defaultProps = {
  layout: 'none',
  renderTooltip: null,
  theme: {},
  animated: false,
};

class Network extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
    layout(this.state.graph, (newGraph) => {
      this.setState({ graph: newGraph });
    });
  }


  componentWillReceiveProps(nextProps) {
    const { graph } = nextProps;
    if (!graph.isFinished &&
        this.state.graph.nodes !== graph.nodes &&
        this.state.graph.links !== graph.links) {
      layout(graph, (newGraph) => {
        this.setState({ graph: newGraph });
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.graph.isFinished) {
      return true;
    }
    return false;
  }

  getStateFromProps(props) {
    return {
      graph: props.graph,
    };
  }

  render() {
    const {
      ariaLabel,
      height,
      width,
    } = this.props;
    return (
      <WithTooltip renderTooltip={this.props.renderTooltip}>
        {({ onMouseMove, onMouseLeave }) => (
          <svg
            aria-label={ariaLabel}
            role="img"
            width={width}
            height={height}
          >
            <Graph
              linkComponent={Link}
              nodeComponent={Node}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              onNodeClick={this.props.onNodeClick}
              graph={this.state.graph}
            />
          </svg>
        )}
      </WithTooltip>
    );
  }

}

Network.defaultProps = defaultProps;
Network.propTypes = propTypes;

export default Network;
