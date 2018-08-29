import React from 'react';
import PropTypes from 'prop-types';
import { linkStyleShape, linkShape } from '../utils/propShapes';

const propTypes = {
  linkStyles: linkStyleShape,
  link: linkShape.isRequired,
  onMouseMove: PropTypes.func,
  onClick: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseEnter: PropTypes.func,
};

const defaultProps = {
  linkStyles: {
    stroke: '#15aabf',
    strokeWidth: 1,
    strokeOpacity: 0.5,
  },
  onMouseMove: null,
  onClick: null,
  onMouseLeave: null,
  onMouseEnter: null,
};

export default function Link({
  linkStyles,
  link,
  onMouseMove,
  onClick,
  onMouseLeave,
  onMouseEnter,
}) {
  const { stroke, strokeWidth, strokeOpacity } = linkStyles;

  return (
    <line
      x1={link.sourceX}
      y1={link.sourceY}
      x2={link.targetX}
      y2={link.targetY}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={link.opacity || strokeOpacity}
      onMouseMove={
        onMouseMove &&
        (event => {
          onMouseMove({
            event,
            index: link.index,
            id: link.id,
            data: link,
          });
        })
      }
      onMouseLeave={
        onMouseLeave &&
        (event => {
          onMouseLeave({
            event,
            index: link.index,
            id: link.id,
            data: link,
          });
        })
      }
      onMouseEnter={
        onMouseEnter &&
        (event => {
          onMouseEnter({
            event,
            index: link.index,
            id: link.id,
            data: link,
          });
        })
      }
      onClick={
        onClick &&
        (event => {
          onClick({
            event,
            index: link.index,
            id: link.id,
            data: link,
          });
        })
      }
    />
  );
}

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;
