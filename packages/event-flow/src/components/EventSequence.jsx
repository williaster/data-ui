import PropTypes from 'prop-types';
import React from 'react';

import { Bar, Line } from '@vx/shape';
import { Point } from '@vx/point';
import { Group } from '@vx/group';

import { scaleShape } from '../propShapes';


import {
  ENTITY_ID,
  ELAPSED_MS_ROOT,
  EVENT_UUID,
  EVENT_NAME,
} from '../constants';

import { yTickStyles } from '../theme';

const CIRCLE_RADIUS = 5;

const propTypes = {
  sequence: PropTypes.arrayOf(PropTypes.object),
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  colorScale: scaleShape.isRequired,
  showEventLabels: PropTypes.bool,
  emphasisIndex: PropTypes.number,
};

const defaultProps = {
  sequence: [],
  showEventLabels: true,
  emphasisIndex: NaN,
};

function EventSequence({
  sequence,
  xScale,
  yScale,
  colorScale,
  showEventLabels,
  emphasisIndex,
}) {
  const entityId = (sequence[0] || {})[ENTITY_ID];
  const zeroIndex = sequence.zeroIndex;
  const y = yScale(entityId);
  const [xMin, xMax] = xScale.range();
  const innerWidth = Math.max(xMin, xMax);
  const emphasizeBounds = [];

  const events = sequence.map((event, index) => {
    const x = xScale(event[ELAPSED_MS_ROOT]);
    const color = colorScale.scale(colorScale.accessor(event));
    const relativeIndex = index - zeroIndex;
    if (relativeIndex === 0) emphasizeBounds[0] = x;
    if (relativeIndex === emphasisIndex) emphasizeBounds[1] = x;

    return (
      <Group
        key={`${event[EVENT_UUID]}`}
        left={x}
        top={y}
      >
        <circle
          r={CIRCLE_RADIUS}
          opacity={0.75}
          fill={color}
          stroke={relativeIndex === 0 ? '#000' : '#fff'}
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
  });

  const emphasisMin = Math.min(...emphasizeBounds);
  const emphasisMax = Math.max(...emphasizeBounds);

  return (
    <Group>
      <Line
        from={new Point({ x: xMin, y })}
        to={new Point({ x: xMax, y })}
        strokeWidth={1}
        stroke="#DBDBDB"
      />
      <text
        x={innerWidth + 8}
        y={y}
        {...yTickStyles.label.right}
      >
        {entityId}
      </text>
      <Bar
        fill="#DBDBDB"
        rx={CIRCLE_RADIUS}
        ry={CIRCLE_RADIUS}
        x={emphasisMin}
        y={y - (CIRCLE_RADIUS / 2)}
        width={emphasisMax - emphasisMin}
        height={CIRCLE_RADIUS + 1}
      />
      {events}
    </Group>
  );
}

EventSequence.propTypes = propTypes;
EventSequence.defaultProps = defaultProps;

export default EventSequence;
