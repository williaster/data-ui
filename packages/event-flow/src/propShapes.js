import PropTypes from 'prop-types';

import {
  TS,
  EVENT_NAME,
  ENTITY_ID,
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
