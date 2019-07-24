import PropTypes from 'prop-types';
import interpolatorLookup from './interpolatorLookup';

export const stringNumberDateObjectPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.instanceOf(Date),
  PropTypes.object, // eg a moment() instance
]);

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
    x: stringNumberDateObjectPropType,
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
    x: stringNumberDateObjectPropType,
    binData: PropTypes.array.isRequired,
  }),
);

export const lineSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: stringNumberDateObjectPropType,
    y: PropTypes.number, // null data are not rendered
  }),
);

export const areaSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: stringNumberDateObjectPropType,
    y: PropTypes.number, // null data are not rendered
    y0: PropTypes.number,
    y1: PropTypes.number,
  }),
);

export const barSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x: stringNumberDateObjectPropType,
    y: stringNumberDateObjectPropType,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    label: PropTypes.string,
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
    x: stringNumberDateObjectPropType,
    y: PropTypes.number,
    size: PropTypes.number,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeDasharray: PropTypes.string,
    label: PropTypes.string,
  }),
);

export const intervalSeriesDataShape = PropTypes.arrayOf(
  PropTypes.shape({
    x0: stringNumberDateObjectPropType,
    x1: stringNumberDateObjectPropType,
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

export const generalStyleShape = PropTypes.shape({
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  strokeOpacity: PropTypes.number,
  fill: PropTypes.string,
  fillOpacity: PropTypes.number,
});

export const marginShape = PropTypes.shape({
  top: PropTypes.number,
  left: PropTypes.number,
  right: PropTypes.number,
  bottom: PropTypes.number,
});

export const brushShape = PropTypes.shape({
  start: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  end: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  extent: PropTypes.shape({
    x0: PropTypes.number.isRequired,
    y0: PropTypes.number.isRequired,
    x1: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
  }),
  bounds: PropTypes.shape({
    x0: PropTypes.number.isRequired,
    y0: PropTypes.number.isRequired,
    x1: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
  }),
});

export const dragShape = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  dx: PropTypes.number,
  dy: PropTypes.number,
  isDragging: PropTypes.bool,
  dragEnd: PropTypes.func,
  dragMove: PropTypes.func,
  dragStart: PropTypes.func,
});
