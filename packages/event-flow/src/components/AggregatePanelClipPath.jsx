import React from 'react';
import PropTypes from 'prop-types';

import { CLIP_ID as id } from '../constants';

const propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

const defaultProps = {
  x: 0,
  y: 0,
};

export default function AggregatePanelClipPath({
  x,
  y,
  width,
  height,
}) {
  return (
    <defs>
      <clipPath id={id}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
        />
      </clipPath>
    </defs>
  );
}

AggregatePanelClipPath.propTypes = propTypes;
AggregatePanelClipPath.defaultProps = defaultProps;

export const CLIP_ID = id;
