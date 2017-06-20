import { Button } from '@data-ui/forms';
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
  top: 4 * unit,
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
    overflowY: 'auto',
    dipslay: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nodeSequence: {
    paddingTop: 1 * unit,
    paddingLeft: 1 * unit,
    flexGrow: 1,
    flexWrap: 'wrap',
  },

  controls: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    flexShrink: 0,
    fontWeight: 200,
    marginLeft: 1 * unit,
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
  // given a sequence count, returns an estimate of the panel height
  static getEstimatedHeight(numSequences) {
    return (numSequences * 40) + margin.top;
  }

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
    const hasSequences = sequences && sequences.length > 0;
    const innerHeight = Math.max(...yScale.range());
    const nodeSequence = ancestorsFromNode(node);

    if (!sequences || !sequences.length || !node) {
      return null;
    }

    return (
      <div className={css(styles.container)} style={{ height }}>

        <div className={css(styles.header)}>
          {hasSequences &&
            <div className={css(styles.nodeSequence)}>
              <NodeSequence
                nodeArray={node.depth < 0 ? nodeSequence.reverse() : nodeSequence}
                separator={node.depth < 0 ? ' < ' : ' > '}
                colorScale={colorScale}
              />
            </div>}
          <div className={css(styles.controls)}>
            {hasSequences &&
              <div>
                <input
                  id="event_labels"
                  name="event_labels"
                  type="checkbox"
                  checked={showEventLabels}
                  onChange={this.toggleEventLabels}
                />
                <label htmlFor="event_labels">Show labels</label>
              </div>}
            <Button
              onClick={clearSelection}
              disabled={!hasSequences}
            >
              Clear Selection
            </Button>
          </div>
        </div>

        {hasSequences &&
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
          </svg>}
      </div>
    );
  }
}

SingleSequencePanel.propTypes = propTypes;
SingleSequencePanel.defaultProps = defaultProps;

export default SingleSequencePanel;
