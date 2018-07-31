import PropTypes from 'prop-types';

export const numericBinnedDatumShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  bin0: PropTypes.number.isRequired,
  bin1: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,

  cumulative: PropTypes.number,
  density: PropTypes.number,
  cumulativeDensity: PropTypes.number,
});

export const categoricalBinnedDatumShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  bin: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,

  cumulative: PropTypes.number,
  density: PropTypes.number,
  cumulativeDensity: PropTypes.number,
});

export const binnedDataShape = PropTypes.arrayOf(
  PropTypes.oneOfType([numericBinnedDatumShape, categoricalBinnedDatumShape]),
);

// styles ---------------------------------------------------------------------
export const axisStylesShape = PropTypes.shape({
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  label: PropTypes.shape({
    left: PropTypes.object,
    right: PropTypes.object,
    bottom: PropTypes.object,
    top: PropTypes.object,
  }),
});

export const tickStylesShape = PropTypes.shape({
  stroke: PropTypes.string,
  tickLength: PropTypes.number,
  label: PropTypes.shape({
    left: PropTypes.object,
    right: PropTypes.object,
    bottom: PropTypes.object,
    top: PropTypes.object,
  }),
});

export const gridStylesShape = PropTypes.shape({
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
});

export const themeShape = PropTypes.shape({
  gridStyles: gridStylesShape,
  xAxisStyles: axisStylesShape,
  xTickStyles: tickStylesShape,
  yAxisStyles: axisStylesShape,
  yTickStyles: tickStylesShape,
});
