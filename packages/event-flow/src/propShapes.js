import PropTypes from 'prop-types';

import {
  TS,
  EVENT_NAME,
  ENTITY_ID,

  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,
  EVENT_COUNT_SCALE,
  NODE_SEQUENCE_SCALE,
} from './constants';

export const rawDataAccessorShape = {
  [TS]: PropTypes.func.isRequired,
  [EVENT_NAME]: PropTypes.func.isRequired,
  [ENTITY_ID]: PropTypes.func.isRequired,
};

export const datumShape = PropTypes.shape({
  [TS]: PropTypes.instanceOf(Date).isRequired,
  [EVENT_NAME]: PropTypes.string.isRequired,
  [ENTITY_ID]: PropTypes.string.isRequired,
});

export const dataShape = PropTypes.arrayOf(datumShape);

export const graphShape = PropTypes.shape({
  nodes: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  totalEventCount: PropTypes.number.isRequired,
  filteredEventCount: PropTypes.number.isRequired,
});

export const nodeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  depth: PropTypes.number.isRequired,
  parent: PropTypes.object,
  children: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
});

export const linkShape = PropTypes.shape({
  source: nodeShape.isRequired,
  target: nodeShape.isRequired,
});

export const scaleShape = PropTypes.shape({
  scale: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  accessor: PropTypes.func.isRequired,
  isTimeScale: PropTypes.bool,
});

export const xScaleTypeShape = PropTypes.oneOf([
  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,
]);

export const yScaleTypeShape = PropTypes.oneOf([
  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,
]);
