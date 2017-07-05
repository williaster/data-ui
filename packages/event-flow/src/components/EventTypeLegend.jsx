/* eslint jsx-a11y/no-static-element-interactions: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { LegendOrdinal } from '@vx/legend';

import { FILTERED_EVENTS } from '../constants';

const propTypes = {
  scale: PropTypes.func.isRequired,
  labelFormat: PropTypes.func,
  onClick: PropTypes.func,
  hiddenEventTypes: PropTypes.objectOf(PropTypes.bool),
};

const defaultProps = {
  labelFormat: label => label,
  onClick: () => {},
  hiddenEventTypes: {
    FILTERED_EVENTS: true,
  },
};

function EventTypeLegend({
  scale,
  labelFormat,
  hiddenEventTypes,
  onClick,
}) {
  return (
    <LegendOrdinal
      direction="column"
      scale={scale}
      shape={({ fill, width, height, label }) => {
        const value = label.datum;
        const isHidden = Boolean(hiddenEventTypes[value]);
        return value === FILTERED_EVENTS ? (
          <svg width={width} height={height}>
            <rect
              width={width}
              height={height}
              fill={fill}
            />
          </svg>
        ) : (
          <div
            style={{
              width,
              height,
              cursor: 'pointer',
              background: isHidden ? 'transparent' : fill,
              boxShadow: isHidden ? `inset 0 0 0 2px ${fill}` : 'none',
            }}
            onClick={() => { onClick(value); }}
          />
        );
      }}
      fill={({ datum }) => scale(datum)}
      labelFormat={labelFormat}
    />
  );
}

EventTypeLegend.propTypes = propTypes;
EventTypeLegend.defaultProps = defaultProps;

export default EventTypeLegend;
