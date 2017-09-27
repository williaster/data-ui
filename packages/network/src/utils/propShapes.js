import PropTypes from 'prop-types';


export const nodeShape = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
});

export const nodeStyleshape = PropTypes.shape({
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
  opacity: PropTypes.number,
});

export const linkShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  source: nodeShape,
  target: nodeShape,
});

export const linkStyleShape = PropTypes.shape({
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  opacity: PropTypes.number,
});
