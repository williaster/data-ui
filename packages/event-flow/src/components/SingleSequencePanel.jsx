import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import React from 'react';
import { Line } from '@vx/shape';
import { Point } from '@vx/point';
import { Group } from '@vx/group';

import NodeSequence from './NodeSequence';
import XAxis from './XAxis';
import ZeroLine from './ZeroLine';

import {
  ENTITY_ID,
  ELAPSED_MS_ROOT,
  EVENT_UUID,
  EVENT_NAME,
} from '../constants';

import {
  computeTimeScaleForSequences,
  computeEntityNameScale,
  getTimeFormatter,
} from '../utils/scale-utils';

import { ancestorsFromNode } from '../utils/graph-utils';

import { datumShape, scaleShape, nodeShape } from '../propShapes';
import { yTickStyles } from '../theme';

const unit = 8;

const margin = {
  top: (2 * unit) + (XAxis.height / 2),
  left: 3 * unit,
  right: (2 * unit) + 100,
  bottom: 2 * unit,
};

const styles = StyleSheet.create({
  container: {
    fontFamily: 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif', // @todo fix this mess
    position: 'relative',
    background: '#fff',
    width: '100%',
    height: '100%',
    borderTop: '1px solid #ddd',
    paddingTop: 1.5 * unit,
  },

  header: {
    position: 'absolute',
    top: -1,
    right: 0, // padding
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'top',
    width: '100%',
  },

  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  showLabelsCheckbox: {
    fontSize: 12,
    fontWeight: 200,
  },

  clearSelectionButton: {
    cursor: 'pointer',
    border: '1px solid #ddd',
    background: '#fff',
    marginLeft: unit,
    padding: `${0.5 * unit}px ${unit}px`,
    borderBottomLeftRadius: 0.5 * unit,
    color: '#484848',
    outline: 'none',
    zIndex: 1,
  },
});

const propTypes = {
  sequences: PropTypes.arrayOf(PropTypes.arrayOf(datumShape)),
  node: nodeShape.isRequired,
  clearSelection: PropTypes.func.isRequired,
  colorScale: scaleShape.isRequired,
  width: PropTypes.number.isRequired,
};

const defaultProps = {
  sequences: [],
};

class SingleSequencePanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toggleEventLabels = this.toggleEventLabels.bind(this);

    const { sequences, width } = props;
    const innerWidth = width - margin.left - margin.right;

    this.state = {
      xScale: computeTimeScaleForSequences(sequences, innerWidth),
      yScale: computeEntityNameScale(sequences),
      mousedOverEvent: null,
      showEventLabels: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.sequences &&
      (this.props.sequences !== nextProps.sequences || this.width !== nextProps.width)
    ) {
      const { sequences, width } = nextProps;
      const innerWidth = width - margin.left - margin.right;
      this.setState({
        xScale: computeTimeScaleForSequences(sequences, innerWidth),
        yScale: computeEntityNameScale(sequences),
      });
    }
  }

  toggleEventLabels() {
    this.setState({ showEventLabels: !this.state.showEventLabels });
  }

  render() {
    const { width, node, sequences, colorScale, clearSelection } = this.props;
    const { xScale, yScale, showEventLabels } = this.state;

    if (!sequences || !sequences.length) {
      return null;
    }

    const innerHeight = Math.max(...yScale.range());
    const innerWidth = Math.max(...xScale.range());

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.header)}>
          <NodeSequence
            nodeArray={ancestorsFromNode(node)}
            separator={node.depth < 0 ? '<' : '>'}
            colorScale={colorScale}
          />
          <div className={css(styles.controls)}>
            <button
              className={css(styles.clearSelectionButton)}
              onClick={clearSelection}
            >
              Clear Selection
            </button>
            <div className={css(styles.showLabelsCheckbox)}>
              <input
                id="event_labels"
                name="event_labels"
                type="checkbox"
                checked={showEventLabels}
                onChange={this.toggleEventLabels}
              />
              <label htmlFor="event_labels">Show labels</label>
            </div>
          </div>
        </div>
        <svg
          role="img"
          aria-label="Single event sequences"
          width={width}
          height={innerHeight + margin.top + margin.bottom}
        >
          <Group left={margin.left} top={margin.top}>
            <XAxis
              scale={xScale}
              labelOffset={0}
              height={innerHeight}
              tickFormat={getTimeFormatter(xScale)}
            />
            <ZeroLine xScale={xScale} yScale={yScale} />
            {sequences.map((sequence) => {
              const entityId = (sequence[0] || {})[ENTITY_ID];
              return (
                <Group
                  key={`${yScale(entityId)}-${sequence.length}`}
                  top={yScale(entityId)}
                >
                  <Line
                    from={new Point({ x: 0, y: 0 })}
                    to={new Point({ x: innerWidth, y: 0 })}
                    strokeWidth={1}
                    stroke="#DBDBDB"
                  />
                  <text
                    x={innerWidth + 8}
                    y={0}
                    {...yTickStyles.label.right}
                  >
                    {entityId}
                  </text>
                  {sequence.map((event) => {
                    const color = colorScale.scale(event[EVENT_NAME]);
                    // @todo replace with glyph dot?
                    // @todo toggle labels off/on?
                    // @todo emphasize event of interest
                    return (
                      <Group
                        key={`${event[EVENT_UUID]}`}
                        left={xScale(event[ELAPSED_MS_ROOT])}
                      >
                        <circle
                          cx={0}
                          cy={0}
                          r={5}
                          opacity={0.75}
                          fill={color}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                        {showEventLabels &&
                          <text
                            {...yTickStyles.label.right}
                            y={10}
                            fill={color}
                          >
                            {event[EVENT_NAME]}
                          </text>}
                      </Group>
                    );
                  })}
                </Group>
              );
            })}
          </Group>
        </svg>
      </div>
    );
  }
}

SingleSequencePanel.propTypes = propTypes;
SingleSequencePanel.defaultProps = defaultProps;

export default SingleSequencePanel;
