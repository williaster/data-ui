import { css, StyleSheet } from 'aphrodite';
import { Group } from '@vx/group';
import PropTypes from 'prop-types';
import React from 'react';

import EventSequence from './EventSequence';
import NodeSequence from './NodeSequence';
import XAxis from './XAxis';
import ZeroLine from './ZeroLine';

import {
  computeTimeScaleForSequences,
  computeEntityNameScale,
  getTimeFormatter,
} from '../utils/scale-utils';

import {
  ENTITY_ID,
} from '../constants';

import { ancestorsFromNode } from '../utils/graph-utils';
import { datumShape, scaleShape, nodeShape } from '../propShapes';

const unit = 8;

const margin = {
  top: (3 * unit) + (XAxis.height / 2),
  left: 3 * unit,
  right: (3 * unit) + 100,
  bottom: 2 * unit,
};

const styles = StyleSheet.create({
  container: {
    fontFamily: 'BlinkMacSystemFont,Roboto,Helvetica Neue,sans-serif', // @todo fix this mess
    position: 'relative',
    background: '#fff',
    width: '100%',
    borderTop: '1px solid #ddd',
    paddingTop: 1.5 * unit,
    overflowY: 'auto',
  },

  header: {
    position: 'absolute',
    top: -1, // border
    right: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'top',
    width: '100%',
  },

  controls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 0,
  },

  showLabelsCheckbox: {
    paddingTop: 0.5 * unit,
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
  height: PropTypes.number.isRequired,
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
      showEventLabels: false,
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
    const { width, node, sequences, colorScale, clearSelection, height } = this.props;
    const { xScale, yScale, showEventLabels } = this.state;

    if (!sequences || !sequences.length || !node) {
      return null;
    }

    const innerHeight = Math.max(...yScale.range());
    const nodeSequence = ancestorsFromNode(node);

    return (
      <div className={css(styles.container)} style={{ height }}>

        <div className={css(styles.header)}>
          <NodeSequence
            nodeArray={node.depth < 0 ? nodeSequence.reverse() : nodeSequence}
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
          ref={(ref) => { this.svg = ref; }}
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
            {sequences.map(sequence => (
              <EventSequence
                key={`${(sequence[0] || {})[ENTITY_ID]}-${sequence.length}`}
                sequence={sequence}
                xScale={xScale}
                yScale={yScale}
                colorScale={colorScale}
                emphasisIndex={node.depth}
                showEventLabels={showEventLabels}
              />
            ))}
          </Group>
        </svg>
      </div>
    );
  }
}

SingleSequencePanel.propTypes = propTypes;
SingleSequencePanel.defaultProps = defaultProps;

export default SingleSequencePanel;
