import PropTypes from 'prop-types';
import interpolatorLookup from './interpolatorLookup';

export const scaleShape = PropTypes.shape({
  type: PropTypes.oneOf(['time', 'timeUtc', 'linear', 'band']).isRequired,

  includeZero: PropTypes.bool,

  // these would override any computation done by xyplot
  // and would allow specifying colors for scales, etc.
  range: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  rangeRound: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  domain: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
});

export const boxPlotSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([
      // data with null x/y are not rendered
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.object, // eg a moment() instance
    ]),
    median: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    firstQuartile: PropTypes.number.isRequired,
    thirdQuartile: PropTypes.number.isRequired,
    outliers: PropTypes.array.isRequired,
  }),
);

export const violinPlotSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([
      // data with null x/y are not rendered
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.object, // eg a moment() instance
    ]),
    binData: PropTypes.array.isRequired,
  }),
);

export const lineSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([
      // data with null x/y are not rendered
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.object, // eg a moment() instance
    ]),
    y: PropTypes.number, // null data are not rendered
  }),
);

export const areaSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([
      // data with null x/y are not rendered
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.object, // eg a moment() instance
    ]),
    y: PropTypes.number, // null data are not rendered
    y0: PropTypes.number,
    y1: PropTypes.number,
  }),
);

export const barSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.object, // eg a moment() instance
    ]).isRequired,
    y: PropTypes.number, // null data are not rendered
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
  }),
);

export const groupedBarSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object, // eg a moment() instance
    ]).isRequired,
    y: PropTypes.number.isRequired,
  }),
);

export const stackedBarSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object, // eg a moment() instance
    ]).isRequired,
    y: PropTypes.number.isRequired,
  }),
);

export const pointSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: PropTypes.oneOfType([
      // data with null x/y are not rendered
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.object, // eg a moment() instance
    ]),
    y: PropTypes.number,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
  }),
);

export const intervalSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x0: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.object, // eg a moment() instance
    ]).isRequired,
    x1: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.object, // eg a moment() instance
    ]).isRequired,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
  }),
);

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

export const interpolationShape = PropTypes.oneOf(Object.keys(interpolatorLookup));

export const pointComponentPropTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  fillOpacity: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  strokeDasharray: PropTypes.string,
  onClick: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  data: pointSeriesDataShape.isRequired,
  datum: PropTypes.object.isRequired,
};
