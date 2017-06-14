import PropTypes from 'prop-types';
import React from 'react';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';

import XAxis from './XAxis';

import {
  ENTITY_ID,
  ELAPSED_MS_ROOT,
  EVENT_UUID,
} from '../constants';

import { computeTimeScaleForSequences, computeEntityNameScale } from '../utils/scale-utils';
import { nodeShape, scaleShape } from '../propShapes';
import { yTickStyles } from '../theme';

function collectSequencesFromNodes(nodes, entityEvents) {
  const entitiesSeen = {};
  const sequences = [];

  // collect all events from all entities included in this node
  if (nodes) {
    Object.keys(nodes).forEach((nodeId) => {
      const node = nodes[nodeId];
      if (node && node.events) {
        Object.keys(node.events).forEach((eventId) => {
          const event = node.events[eventId];
          const entityId = event.ENTITY_ID;
          if (!entitiesSeen[entityId]) {
            sequences.push(entityEvents[entityId]);
            entitiesSeen[entityId] = true;
          }
        });
      }
    });
  }

  return sequences;
}

const margin = {
  top: 16 + (XAxis.height / 2),
  left: 16 + 100,
  right: 40,
  bottom: 16,
};

const propTypes = {
  entityEvents: PropTypes.objectOf(PropTypes.array),
  nodes: PropTypes.objectOf(nodeShape),
  colorScale: scaleShape.isRequired,
  width: PropTypes.number.isRequired,
};

const defaultProps = {
  entityEvents: {},
  nodes: null,
};

class SingleSequencePanel extends React.PureComponent {
  constructor(props) {
    super(props);

    const { nodes, entityEvents, width } = props;
    const innerWidth = width - margin.left - margin.right;
    const sequences = collectSequencesFromNodes(nodes, entityEvents);

    this.state = {
      sequences,
      xScale: computeTimeScaleForSequences(sequences, innerWidth),
      yScale: computeEntityNameScale(sequences),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.nodes !== nextProps.nodes ||
      this.props.entityEvents !== nextProps.entityEvents ||
      this.width !== nextProps.width
    ) {
      const { nodes, entityEvents, width } = nextProps;
      const sequences = collectSequencesFromNodes(nodes, entityEvents);
      this.setState({
        sequences,
        xScale: computeTimeScaleForSequences(sequences, width - margin.left - margin-right),
        yScale: computeEntityNameScale(sequences),
      });
    }
  }

  render() {
    const { width, nodes, colorScale } = this.props;
    const { sequences, xScale, yScale } = this.state;

    if (!nodes) {
      return null;
    }
    debugger;
    const innerWidth = Math.max(...xScale.range());
    const innerHeight = Math.max(...yScale.range());

    return (
      <div
        style={{
          background: '#fff',
          width: '100%',
          height: '100%',
          borderTop: '1px solid #ddd',
          borderBottom: '1px solid #ddd',
          overflowY: 'auto',
          padding: 12,
        }}
      >
        <svg
          role="img"
          aria-label="Single event sequences"
          width={width}
          height={innerHeight + margin.top + margin.bottom}
        >
          <Group left={margin.left} top={margin.top}>
            {/* @todo @vx/grid bug for non-tick scales */}
            <Grid
              xScale={xScale}
              yScale={yScale}
              width={innerWidth}
              height={innerHeight}
              stroke={'#DBDBDB'}
              strokeWidth={1}
              numTicksRows={sequences.length}
              numTicksColumns={2}
            />
            <XAxis
              scale={xScale}
              labelOffset={0}
              height={innerHeight}
              tickFormat={null}
            />
            {sequences.map((sequence) => {
              const entityId = (sequence[0] || {})[ENTITY_ID]; // @todo accessor?
              return (
                <Group
                  key={`${yScale(entityId)}-${sequence.length}`}
                  top={yScale(entityId)}
                >
                  <text
                    x={-10}
                    y={0}
                    {...yTickStyles.label.left}
                  >
                    {entityId}
                  </text>
                  {sequence.map(event => (
                    <circle
                      key={event[EVENT_UUID]}
                      cx={xScale(event[ELAPSED_MS_ROOT])}
                      cy={0}
                      r={5}
                      opacity={0.75}
                      fill={colorScale.scale(event.EVENT_NAME)}
                      stroke="#fff"
                      strokeWidth={1}
                    />
                  ))}
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
