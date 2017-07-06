// import PropTypes from 'prop-types';
import React from 'react';

import {
  datumShape,
  scaleShape,
} from '../propShapes';

import { font } from '../theme';

import {
  ENTITY_ID,
  EVENT_NAME,
  META,
} from '../constants';

const propTypes = {
  event: datumShape,
  xScale: scaleShape,
  colorScale: scaleShape,
};

const defaultProps = {
  event: {},
  xScale: null,
  colorScale: null,
};

function EventDetails({
  event,
  xScale,
  colorScale,
}) {
  if (!xScale || !colorScale) return null;

  const color = colorScale.scale(colorScale.accessor(event));
  const eventName = event[EVENT_NAME];
  const entity = event[ENTITY_ID];
  const xValue = xScale.accessor(event);
  const prettyMeta = JSON.stringify(event[META], null, 2);
  return (
    <div>
      <div style={{ ...font.medium, ...font.bold }}>
        <strong>event</strong> <span style={{ color }}>{eventName}</span>
      </div>
      <div style={{ ...font.small, ...font.light }}>
        <strong>entity id</strong> {entity}
      </div>
      <div style={{ ...font.small, ...font.light }}>
        <strong>{xScale.label}</strong> {xScale.format ? xScale.format(xValue) : xValue}
      </div>
      <pre>
        {prettyMeta}
      </pre>
    </div>
  );
}

EventDetails.propTypes = propTypes;
EventDetails.defaultProps = defaultProps;

export default EventDetails;
