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
  PropTypes.oneOfType([
    numericBinnedDatumShape,
    categoricalBinnedDatumShape,
  ]),
);
