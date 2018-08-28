/* eslint class-methods-use-this: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import { WithTooltip, withTooltipPropTypes } from '@data-ui/shared';
import Layout from '../layout/atlasForce';
import Links from './Links';
import Nodes from './Nodes';
import Link from './Link';
import Node from './Node';

import updateArgsWithCoordsIfNecessary from '../utils/updateArgsWithCoordsIfNecessary';
import { layoutShape } from '../utils/propShapes';

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
  layout: layoutShape,
  preserveAspectRatio: PropTypes.bool,
  scaleToFit: PropTypes.bool,
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
  preserveAspectRatio: true,
  scaleToFit: true,
};

class Network extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      computingLayout: true,
    };

    // if renderTooltip is passed we return another Network wrapped in WithTooltip
    // therefore we don't want to compute a layout if the nested chart will do so
    if (props.renderTooltip) return;

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    const {
      graph,
      animated,
      width,
      height,
      margin,
      layout,
      preserveAspectRatio,
      scaleToFit,
      renderTooltip,
      eventTriggerRefs,
    } = this.props;

    if (!renderTooltip && eventTriggerRefs) {
      eventTriggerRefs({
        mouseenter: this.handleMouseEnter,
        mousemove: this.handleMouseMove,
        mouseleave: this.handleMouseLeave,
        click: this.handleClick,
      });
    }

    this.layout = layout || new Layout();
    this.layout.setAnimated(animated);
    this.layout.setGraph(graph);

    if (this.layout.setBoundingBox) {
      this.layout.setBoundingBox({
        width,
        height,
        margin,
      });
    }
    this.layout.layout({
      callback: nextGraph => {
        this.setGraphState({
          graph: nextGraph,
          width,
          height,
          margin,
          preserveAspectRatio,
          scaleToFit,
        });
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      graph,
      animated,
      width,
      height,
      margin,
      renderTooltip,
      preserveAspectRatio,
      scaleToFit,
    } = nextProps;
    const {
      graph: currGraph,
      width: currWidth,
      height: currHeight,
      margin: currMargin,
    } = this.props;
    const { computingLayout } = this.state;
    if (
      !renderTooltip &&
      (graph.links !== currGraph.links ||
        graph.nodes !== currGraph.nodes ||
        computingLayout ||
        (this.layout.setBoundingBox &&
          (width !== currWidth || height !== currHeight || margin !== currMargin)))
    ) {
      this.layout.clear();
      this.setState(() => ({ computingLayout: true }));
      this.layout.setGraph(graph);
      this.layout.setAnimated(animated);

      // For certain cases, a layout algorithm need to be aware of the actual width, height, etc.,
      // for better layout optimization. Here we pass the width, height, and margin info to the
      // layout instance if setBoundingBox funtion is defined.
      if (this.layout.setBoundingBox) {
        this.layout.setBoundingBox({
          width,
          height,
          margin,
        });
      }
      this.layout.layout({
        callback: nextGraph => {
          this.setGraphState({
            graph: nextGraph,
            width,
            height,
            margin,
            preserveAspectRatio,
            scaleToFit,
          });
        },
      });
    } else {
      this.setGraphState({ graph, width, height, margin, preserveAspectRatio, scaleToFit });
    }
  }

  componentWillUnmount() {
    if (this.layout) this.layout.clear();
  }

  setGraphState({ graph, width, height, margin, preserveAspectRatio, scaleToFit }) {
    if (!scaleToFit) {
      const links = graph.links.map((link, index) => ({
        ...link,
        sourceX: link.source.x,
        sourceY: link.source.y,
        targetX: link.target.x,
        targetY: link.target.y,
        index,
      }));
      this.setState(() => ({
        graph: {
          nodes: graph.nodes,
          links,
        },
        computingLayout: false,
      }));

      return;
    }
    const range = graph.nodes.reduce(
      ({ x, y }, node) => ({
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
      },
    );

    const actualWidth = width - margin.left - margin.right;
    const actualheight = height - margin.top - margin.bottom;
    const dataXRange = range.x.max - range.x.min;
    const dataYRange = range.y.max - range.y.min;

    let xZoomLevel = dataXRange / actualWidth;
    let yZoomLevel = dataYRange / actualheight;

    if (preserveAspectRatio) {
      const zoomLevel = Math.max(xZoomLevel, yZoomLevel);
      xZoomLevel = zoomLevel;
      yZoomLevel = zoomLevel;
    }

    const xOffsetForCentering = (actualWidth - dataXRange / xZoomLevel) / 2;
    const xTotalOffset = margin.left + (xOffsetForCentering - range.x.min / xZoomLevel);

    const yOffsetForCentering = (actualheight - dataYRange / yZoomLevel) / 2;
    const yTotalOffset = margin.top + (yOffsetForCentering - range.y.min / yZoomLevel);

    function xScale(x) {
      return x / xZoomLevel + xTotalOffset;
    }

    function yScale(y) {
      return y / yZoomLevel + yTotalOffset;
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
    const { onClick } = this.props;
    if (onClick) {
      onClick(updateArgsWithCoordsIfNecessary(args, this.props));
    }
  }

  handleMouseEnter(args) {
    const { onMouseEnter } = this.props;
    if (onMouseEnter) {
      onMouseEnter(updateArgsWithCoordsIfNecessary(args, this.props));
    }
  }

  handleMouseMove(args) {
    const { onMouseMove } = this.props;
    if (onMouseMove) {
      onMouseMove(updateArgsWithCoordsIfNecessary(args, this.props));
    }
  }

  handleMouseLeave(args) {
    const { onMouseLeave } = this.props;
    if (onMouseLeave) onMouseLeave(args);
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

    const { graph, computingLayout } = this.state;

    if (renderTooltip) {
      return (
        <WithTooltip renderTooltip={renderTooltip}>
          <Network {...this.props} renderTooltip={null} />
        </WithTooltip>
      );
    }

    return (
      <svg aria-label={ariaLabel} className={className} role="img" width={width} height={height}>
        {graph && (
          <Group>
            <Links
              links={graph.links}
              linkComponent={renderLink || Link}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onMouseMove={this.handleMouseMove}
              onClick={this.handleClick}
            />
            <Nodes
              nodes={graph.nodes}
              nodeComponent={renderNode || Node}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onMouseMove={this.handleMouseMove}
              onClick={this.handleClick}
            />
          </Group>
        )}

        {children}

        {computingLayout &&
          waitingForLayoutLabel && (
            <Group>
              <rect width={width} height={height} opacity={0.8} fill="#ffffff" />
              <text
                x={width / 2}
                y={height / 2}
                textAnchor="middle"
                stroke="#ffffff"
                paintOrder="stroke"
              >
                {waitingForLayoutLabel}
              </text>
            </Group>
          )}
      </svg>
    );
  }
}

Network.defaultProps = defaultProps;
Network.propTypes = propTypes;

export default Network;
