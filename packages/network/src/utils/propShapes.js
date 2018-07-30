import PropTypes from 'prop-types';

export const nodeShape = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
});

export const nodeStyleShape = PropTypes.shape({
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

export const layoutShape = PropTypes.shape({
  getGraph: PropTypes.func.isRequired,
  setGraph: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  layout: PropTypes.func.isRequired,
  setAnimated: PropTypes.func.isRequired,
  setBoundingBox: PropTypes.func,
});
