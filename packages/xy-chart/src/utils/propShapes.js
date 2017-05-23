import PropTypes from 'prop-types';

export const scaleShape = PropTypes.shape({
  accessor: PropTypes.func,
  type: PropTypes.oneOf([
    'time',
    'linear',
    'ordinal',
  ]).isRequired,

  includeZero: PropTypes.bool,

  // these would override any computation done by xyplot
  // and would allow specifying colors for scales, etc.
  range: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  domain: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
});

// export const axisShape = PropTypes.shape({
//   orientation: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
//   label: PropTypes.string,
//   showGrid: PropTypes.bool,
//   showTicks: PropTypes.bool,
//   tickFormat: PropTypes.func,
//   numTicks: PropTypes.number,
//   tickValues: PropTypes.oneOfType([ // array of tick values or a function that returns one
//     PropTypes.func,
//     PropTypes.arrayOf(PropTypes.string),
//   ]),
// });
