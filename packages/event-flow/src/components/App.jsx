/* eslint class-methods-use-this: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import SplitPane from 'react-split-pane';

import '../splitpane.css';

import ControlPanel, { width as CONTROLS_WIDTH } from './ControlPanel';
import Visualization, { margin as VIS_MARGIN } from './Visualization';

import { findNthIndexOfX, getMetaDataFromNodes } from '../utils/data-utils';
import { buildGraph } from '../utils/graph-utils';
import { buildAllScales, nodeSorters } from '../utils/scale-utils';
import { dataShape } from '../propShapes';

import {
  ANY_EVENT_TYPE,
  EVENT_NAME,
  ELAPSED_TIME_SCALE,
  EVENT_COUNT_SCALE,
  NODE_COLOR_SCALE,
  ORDER_BY_EVENT_COUNT,
} from '../constants';

const propTypes = {
  data: dataShape,
  initialShowControls: PropTypes.bool,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const defaultProps = {
  data: [],
  initialShowControls: true,
};

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onToggleShowControls = this.onToggleShowControls.bind(this);
    this.handleAlignByIndex = this.handleAlignByIndex.bind(this);
    this.handleAlignByEventType = this.handleAlignByEventType.bind(this);
    this.handleClickLegend = this.handleClickLegend.bind(this);

    const { width, height, data, initialShowControls } = props;
    const visualizationWidth = this.getVisualizationWidth(width, initialShowControls);
    const alignByEventType = ANY_EVENT_TYPE;
    const alignByIndex = 1;
    const hiddenEventTypes = {};
    const graph = this.getGraph({ data, alignByIndex, alignByEventType, hiddenEventTypes });
    const scales = this.getScales(graph, visualizationWidth, height);

    this.state = {
      alignByIndex,
      alignByEventType,
      xScaleType: ELAPSED_TIME_SCALE,
      yScaleType: EVENT_COUNT_SCALE,
      orderBy: ORDER_BY_EVENT_COUNT,
      showControls: initialShowControls,
      hiddenEventTypes,
      visualizationWidth,
      graph,
      scales,
      selectedNode: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {};
    if (this.props.data !== nextProps.data) {
      const { alignByIndex, alignByEventType } = this.state;
      nextState.hiddenEventTypes = {};
      nextState.graph = this.getGraph({
        data: nextProps.data,
        alignByIndex,
        alignByEventType,
        hiddenEventTypes: nextState.hiddenEventTypes,
      });
    }
    if (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      nextState.graph
    ) {
      const { showControls, graph, scales: prevScales } = this.state;
      nextState.visualizationWidth = this.getVisualizationWidth(nextProps.width, showControls);
      nextState.scales = this.getScales(
        nextState.graph || graph,
        nextState.visualizationWidth,
        nextProps.height,
      );
      if (!nextState.hiddenEventTypes) {
        nextState.scales[NODE_COLOR_SCALE].scale = prevScales[NODE_COLOR_SCALE].scale;
      }
    }
    if (Object.keys(nextState).length > 0) {
      nextState.selectedNode = null;
      this.setState(nextState);
    }
  }

  onToggleShowControls() {
    const { width, height } = this.props;
    const { showControls: prevShowControls, graph } = this.state;
    const showControls = !prevShowControls;
    const visualizationWidth = this.getVisualizationWidth(width, showControls);

    this.setState({
      visualizationWidth,
      // use the previous color scale in case event types are hidden
      scales: {
        ...this.getScales(graph, visualizationWidth, height),
        [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE],
      },
      showControls,
    });
  }

  getVisualizationWidth(width, showControls) {
    return width - (showControls ? CONTROLS_WIDTH + VIS_MARGIN.right : 0);
  }

  getGraph({ data, alignByIndex, alignByEventType, hiddenEventTypes }) {
    // the graph is built from a root event derived from event type + index
    return buildGraph({
      cleanedEvents: data,
      getStartIndex: eventSequence => (
        findNthIndexOfX(eventSequence, alignByIndex, event => (
          alignByEventType === ANY_EVENT_TYPE || event[EVENT_NAME] === alignByEventType
        ))
      ),
      ignoreEventTypes: hiddenEventTypes,
    });
  }

  getScales(graph, width, height) {
    const innerWidth = width - VIS_MARGIN.left - VIS_MARGIN.right;
    const innerHeight = height - VIS_MARGIN.top - VIS_MARGIN.bottom;
    console.time('buildScales');
    const scales = buildAllScales(graph, innerWidth, innerHeight);
    console.timeEnd('buildScales');
    return scales;
  }

  handleAlignByIndex(alignByIndex) {
    const { data, height } = this.props;
    const { alignByEventType, visualizationWidth, hiddenEventTypes } = this.state;
    const graph = this.getGraph({ data, alignByIndex, alignByEventType, hiddenEventTypes });
    const scales = { // use the previous color scale in case event types are hidden
      ...this.getScales(graph, visualizationWidth, height),
      [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE],
    };
    this.setState({ alignByIndex, graph, scales, hiddenEventTypes });
  }

  handleAlignByEventType(alignByEventType) {
    const { data, height } = this.props;
    const { alignByIndex, visualizationWidth, hiddenEventTypes } = this.state;
    const graph = this.getGraph({ data, alignByIndex, alignByEventType, hiddenEventTypes });
    const scales = { // use the previous color scale in case event types are hidden
      ...this.getScales(graph, visualizationWidth, height),
      [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE],
    };
    this.setState({ alignByEventType, graph, scales, hiddenEventTypes });
  }

  handleClickLegend(eventType) {
    const { data, height } = this.props;
    const { alignByIndex, visualizationWidth, alignByEventType, hiddenEventTypes } = this.state;
    const nextHiddenEventTypes = {
      ...hiddenEventTypes,
      [eventType]: !hiddenEventTypes[eventType],
    };

    const graph = this.getGraph({
      data,
      alignByIndex,
      alignByEventType,
      hiddenEventTypes: nextHiddenEventTypes,
    });

    const scales = { // use the previous color scale in case event types are hidden
      ...this.getScales(graph, visualizationWidth, height),
      [NODE_COLOR_SCALE]: this.state.scales[NODE_COLOR_SCALE],
    };

    this.setState({ graph, scales, hiddenEventTypes: nextHiddenEventTypes });
  }

  render() {
    const {
      alignByIndex,
      alignByEventType,
      orderBy,
      hiddenEventTypes,
      graph,
      scales,
      showControls,
      xScaleType,
      yScaleType,
      visualizationWidth,
      selectedNode,
    } = this.state;

    console.log('graph', graph);
    const { width, height } = this.props;

    let metaData = graph.metaData;
    if (selectedNode) {
      metaData = getMetaDataFromNodes({ [selectedNode.id]: selectedNode });
    }

    return (
      <div style={{ position: 'relative', width, height }}>
        <SplitPane
          size={visualizationWidth}
          minSize={visualizationWidth}
          maxSize={visualizationWidth}
          split="vertical"
        >
          <Visualization
            onClickNode={(selectedNode) => { this.setState({ selectedNode }); }}
            width={visualizationWidth}
            height={height}
            graph={graph}
            xScale={scales[xScaleType]}
            yScale={scales[yScaleType]}
            timeScale={scales[ELAPSED_TIME_SCALE]}
            colorScale={scales[NODE_COLOR_SCALE]}
            nodeSorter={nodeSorters[orderBy]}
          />
          <ControlPanel
            showControls={showControls}
            alignByIndex={alignByIndex}
            alignByEventType={alignByEventType}
            orderBy={orderBy}
            colorScale={scales[NODE_COLOR_SCALE]}
            xScaleType={xScaleType}
            onToggleShowControls={this.onToggleShowControls}
            onChangeAlignByEventType={this.handleAlignByEventType}
            onChangeAlignByIndex={this.handleAlignByIndex}
            onChangeXScale={(type) => { this.setState({ xScaleType: type }); }}
            onChangeOrderBy={(value) => { this.setState({ orderBy: value }); }}
            onClickLegendShape={this.handleClickLegend}
            metaData={metaData}
            hiddenEventTypes={hiddenEventTypes}
            width={width - visualizationWidth}
          />
        </SplitPane>
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
