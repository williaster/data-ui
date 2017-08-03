import PropTypes from 'prop-types';

export const numericBinnedDatum = PropTypes.shape({
  id: PropTypes.string.isRequired,
  bin0: PropTypes.number.isRequired,
  bin1: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  cumulative: PropTypes.number.isRequired,
  density: PropTypes.number.isRequired,
  cumulativeDensity: PropTypes.number.isRequired,
});

export const categoricalBinnedDatum = PropTypes.shape({
  id: PropTypes.string.isRequired,
  bin: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  cumulative: PropTypes.number.isRequired,
  density: PropTypes.number.isRequired,
  cumulativeDensity: PropTypes.number.isRequired,
});

export const binnedData = PropTypes.arrayOf(
  PropTypes.oneOfType([
    numericBinnedDatum,
    categoricalBinnedDatum,
  ]),
);
