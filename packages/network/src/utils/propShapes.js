import PropTypes from 'prop-types';

export const nodeStyleshape = PropTypes.shape({
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
  opacity: PropTypes.number,
});


export const linkStyleShape = PropTypes.shape({
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  opacity: PropTypes.number,
});

export const themeShape = PropTypes.shape({
  nodeStyles: nodeStyleshape,
  linkStyles: linkStyleShape,
});
