import React from 'react';
import PropTypes from 'prop-types';
import { LegendOrdinal } from '@vx/legend';

import { FILTERED_EVENTS } from '../constants';

const propTypes = {
  scale: PropTypes.func.isRequired,
  labelFormat: PropTypes.func,
};

const defaultProps = {
  labelFormat: label => label,
};

function EventTypeLegend({
  scale,
  labelFormat,
}) {
  return (
    <LegendOrdinal
      direction="column"
      scale={scale}
      shape={({ fill, width, height, label }) => (
        label.datum === FILTERED_EVENTS ? (
          <svg width={width} height={height}>
            <rect width={width} height={height} fill={fill} />
          </svg>
        ) : (
          <div
            style={{
              width,
              height,
              background: fill,
            }}
          />
        )
      )}
      fill={({ datum }) => scale(datum)}
      labelFormat={labelFormat}
    />
  );
}

EventTypeLegend.propTypes = propTypes;
EventTypeLegend.defaultProps = defaultProps;

export default EventTypeLegend;
