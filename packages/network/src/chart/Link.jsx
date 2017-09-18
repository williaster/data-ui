import React from 'react';
import PropTypes from 'prop-types';
import { linkStyleShape } from '../utils/propShapes';

const proptypes = {
  linkStyles: linkStyleShape,
  link: PropTypes.object.isRequired,
};

const defaultProps = {
  linkStyles: {
    stroke: '#15aabf',
    strokeWidth: 1,
    strokeOpacity: 0.5,
  },
};

export default function Link(props) {
  const { linkStyles, link } = props;
  const { stroke, strokeWidth, strokeOpacity } = linkStyles;
  return (
    <line
      x1={link.source.x}
      y1={link.source.y}
      x2={link.target.x}
      y2={link.target.y}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
    />
  );
}

Link.propTypes = proptypes;
Link.defaultProps = defaultProps;
