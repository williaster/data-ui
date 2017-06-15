import { PropTypes } from 'prop-types';
import React from 'react';

import { nodeShape, scaleShape } from '../propShapes';
import { ancestorsFromNode } from '../utils/graph-utils';
import { oneDecimal } from '../utils/scale-utils';

import {
  EVENT_NAME,
  ENTITY_ID,
  META,
} from '../constants';

const propTypes = {
  event: PropTypes.object.isRequired,
  timeScale: scaleShape.isRequired,
  colorScale: scaleShape.isRequired,
};

const defaultProps = {};

function NodeDetails({
  event,
  timeScale,
  colorScale,
}) {
  if (!node || !root) return null;

  return (
    <div>
    </div>
  );
}

NodeDetails.propTypes = propTypes;
NodeDetails.defaultProps = defaultProps;

export default NodeDetails;
