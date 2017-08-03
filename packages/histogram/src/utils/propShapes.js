import PropTypes from 'prop-types';

export const numericBinnedDatumShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  bin0: PropTypes.number.isRequired,
  bin1: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  cumulative: PropTypes.number.isRequired,
  density: PropTypes.number.isRequired,
  cumulativeDensity: PropTypes.number.isRequired,
});

export const categoricalBinnedDatumShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  bin: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  cumulative: PropTypes.number.isRequired,
  density: PropTypes.number.isRequired,
  cumulativeDensity: PropTypes.number.isRequired,
});

export const binnedDataShape = PropTypes.arrayOf(
  PropTypes.oneOfType([
    numericBinnedDatumShape,
    categoricalBinnedDatumShape,
  ]),
);
