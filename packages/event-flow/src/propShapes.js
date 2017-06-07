import PropTypes from 'prop-types';

import {
  TS,
  EVENT_NAME,
  ENTITY_ID,
} from '../utils/data-utils';

export const rawDataAccessorShape = {
  [TS]: PropTypes.func.isRequired,
  [EVENT_NAME]: PropTypes.func.isRequired,
  [ENTITY_ID]: PropTypes.func.isRequired,
};

export const datumShape = PropTypes.shape({

});

export const dataShape = PropTypes.arrayOf(datumShape);
