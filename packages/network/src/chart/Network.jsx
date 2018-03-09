/* eslint class-methods-use-this: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import WithTooltip, { withTooltipPropTypes } from '@data-ui/shared/build/enhancer/WithTooltip';
import Layout from '../layout/atlasForce';
import Links from './Links';
import Nodes from './Nodes';
import Link from './Link';
import Node from './Node';

export const propTypes = {
  ...withTooltipPropTypes,
  ariaLabel: PropTypes.string.isRequired,
  animated: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  graph: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    links: PropTypes.array.isRequired,
  }).isRequired,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
  }),
  renderLink: PropTypes.func,
  renderNode: PropTypes.func,
  renderTooltip: PropTypes.func,
  snapTooltipToDataX: PropTypes.bool,
  snapTooltipToDataY: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  eventTriggerRefs: PropTypes.func,
  waitingForLayoutLabel: PropTypes.string,
  width: PropTypes.number.isRequired,
  layout: PropTypes.object,
};

const defaultProps = {
  animated: false,
  children: null,
  className: null,
  renderNode: null,
  renderLink: null,
  renderTooltip: null,
  margin: {
    top: 20,
    left: 20,
    bottom: 20,
    right: 20,
  },
  layout: null,
  snapTooltipToDataX: true,
  snapTooltipToDataY: true,
  onClick: null,
  onMouseEnter: null,
  onMouseMove: null,
  onMouseLeave: null,
  eventTriggerRefs: null,
  waitingForLayoutLabel: 'Computing layout...',
};

function updateArgsWithCoordsIfNecessary(args, props) {
  return {
    ...args,
    coords: {
      ...((props.snapTooltipToDataX) && { x: args.data.x }),
      ...((props.snapTooltipToDataY) && { y: args.data.y }),
      ...args.coords,
    },
  };
}

class Network extends React.PureComponent {
  constructor(props) {
    super(props);

    // if renderTooltip is passed we return another Network wrapped in WithTooltip
    // therefore we don't want to compute a layout if the nested chart will do so
    if (props.renderTooltip) return;

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    const { graph, animated, width, height, margin, layout } = props;
    this.state = {
      computingLayout: true,
    };
    this.layout = layout || new Layout();
    this.layout.setAnimated(animated);
    this.layout.setGraph(graph);
    this.layout.layout({
      callback: (newGraph) => {
        this.setGraphState({ graph: newGraph, width, height, margin });
      },
    });
  }

  componentDidMount() {
    if (!this.props.renderTooltip && this.props.eventTriggerRefs) {
      this.props.eventTriggerRefs({
        mouseenter: this.handleMouseEnter,
        mousemove: this.handleMouseMove,
        mouseleave: this.handleMouseLeave,
        click: this.handleClick,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { graph, animated, width, height, margin, renderTooltip } = nextProps;
    if (
      !renderTooltip && (
        this.props.graph.links !== graph.links
        || this.props.graph.nodes !== graph.nodes
        || this.state.computingLayout
      )) {
      this.layout.clear();
      this.setState(() => ({ computingLayout: true }));
      this.layout.setGraph(graph);
      this.layout.setAnimated(animated);
      this.layout.layout({
        callback: (newGraph) => {
          this.setGraphState({ graph: newGraph, width, height, margin });
        },
      });
    } else {
      this.setGraphState({ graph, width, height, margin });
    }
  }

  componentWillUnmount() {
    if (this.layout) this.layout.clear();
  }

  setGraphState({ graph, width, height, margin }) {
    const range = graph.nodes.reduce(
      ({ x, y }, node) =>
        ({
          x: {
            min: Math.min(x.min, node.x),
            max: Math.max(x.max, node.x),
          },
          y: {
            min: Math.min(y.min, node.y),
            max: Math.max(y.max, node.y),
          },
        }),
      {
        x: {
          min: 999999,
          max: -999999,
        },
        y: {
          min: 999999,
          max: -999999,
        },
      });

    const actualWidth = width - margin.left - margin.right;
    const actualheight = height - margin.top - margin.bottom;
    const dataXRange = range.x.max - range.x.min;
    const dataYRange = range.y.max - range.y.min;

    const zoomLevel = Math.max(
      dataXRange / actualWidth,
      dataYRange / actualheight,
    );

    const xOffsetForCentering = ((actualWidth - (dataXRange / zoomLevel)) / 2);
    const xTotalOffset = margin.left + (xOffsetForCentering - (range.x.min / zoomLevel));

    const yOffsetForCentering = ((actualheight - (dataYRange / zoomLevel)) / 2);
    const yTotalOffset = margin.top + (yOffsetForCentering - (range.y.min / zoomLevel));

    function xScale(x) {
      return (x / zoomLevel) + xTotalOffset;
    }

    function yScale(y) {
      return (y / zoomLevel) + yTotalOffset;
    }

    const nodes = graph.nodes.map(({ x, y, ...rest }, index) => ({
      x: xScale(x),
      y: yScale(y),
      ...rest,
      index,
    }));
    const links = graph.links.map((link, index) => ({
      ...link,
      sourceX: xScale(link.source.x),
      sourceY: yScale(link.source.y),
      targetX: xScale(link.target.x),
      targetY: yScale(link.target.y),
      index,
    }));

    this.setState(() => ({
      graph: { nodes, links },
      computingLayout: false,
    }));
  }

  handleClick(args) {
    if (this.props.onClick) {
      this.props.onClick(
        updateArgsWithCoordsIfNecessary(args, this.props),
      );
    }
  }

  handleMouseEnter(args) {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(
        updateArgsWithCoordsIfNecessary(args, this.props),
      );
    }
  }

  handleMouseMove(args) {
    if (this.props.onMouseMove) {
      this.props.onMouseMove(
        updateArgsWithCoordsIfNecessary(args, this.props),
      );
    }
  }

  handleMouseLeave(args) {
    if (this.props.onMouseLeave) this.props.onMouseLeave(args);
  }

  render() {
    const {
      ariaLabel,
      children,
      className,
      height,
      renderLink,
      renderNode,
      renderTooltip,
      waitingForLayoutLabel,
      width,
    } = this.props;

    if (renderTooltip) {
      return (
        <WithTooltip renderTooltip={renderTooltip}>
          <Network {...this.props} renderTooltip={null} />
        </WithTooltip>
      );
    }

    return (
      <svg
        aria-label={ariaLabel}
        className={className}
        role="img"
        width={width}
        height={height}
      >
        {this.state.graph &&
          <Group>
            <Links
              links={this.state.graph.links}
              linkComponent={renderLink || Link}
            />
            <Nodes
              nodes={this.state.graph.nodes}
              nodeComponent={renderNode || Node}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onMouseMove={this.handleMouseMove}
              onClick={this.handleClick}
            />
          </Group>}

        {children}

        {this.state.computingLayout && waitingForLayoutLabel &&
          <Group>
            <rect
              width={width}
              height={height}
              opacity={0.8}
              fill="#ffffff"
            />
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              stroke="#ffffff"
              paintOrder="stroke"
            >
              {waitingForLayoutLabel}
            </text>
          </Group>}
      </svg>
    );
  }

}

Network.defaultProps = defaultProps;
Network.propTypes = propTypes;

export default Network;
