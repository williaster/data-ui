import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { BoxPlot } from '@vx/stats';
import themeColors from '@data-ui/theme/build/color';

import { callOrValue, isDefined } from '../utils/chartUtils';

import { boxPlotSeriesDataShape } from '../utils/propShapes';

const propTypes = {
  data: boxPlotSeriesDataShape.isRequired,
  label: PropTypes.string.isRequired,

  // attributes on data points will override these
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  horizontal: PropTypes.bool,
  widthRatio: PropTypes.number,
};

const defaultProps = {
  boxWidth: null,
  stroke: '#000000',
  strokeWidth: 2,
  fill: themeColors.default,
  fillOpacity: 1,
  xScale: null,
  yScale: null,
  horizontal: false,
  widthRatio: 1,
};

const MAX_BOX_WIDTH = 50;
const x = d => d.x;
const y = d => d.y;
const min = d => d.min;
const max = d => d.max;
const median = d => d.median;
const firstQuartile = d => d.firstQuartile;
const thirdQuartile = d => d.thirdQuartile;
const outliers = d => d.outliers || [];

export default function BoxPlotSeries({
  data,
  label,
  fill,
  stroke,
  strokeWidth,
  xScale,
  yScale,
  horizontal,
  widthRatio,
  fillOpacity,
}) {
  if (!xScale || !yScale) return null;
  const offsetScale = horizontal ? yScale : xScale;
  const offsetValue = horizontal ? y : x;
  const valueScale = horizontal ? xScale : yScale;
  const boxWidth = offsetScale.bandwidth();
  const actualyWidth = Math.min(MAX_BOX_WIDTH, boxWidth);
  const offset = (offsetScale.offset || 0) - ((boxWidth - actualyWidth) / 2);
  const offsetPropName = horizontal ? 'top' : 'left';
  const offsetProp = d => ({
    [offsetPropName]: (offsetScale(offsetValue(d)) - offset) +
     (((1 - widthRatio) / 2) * actualyWidth),
  });
  return (
    <Group key={label}>
      {data.map((d, i) => (
        isDefined(min(d)) && (
          <BoxPlot
            key={offsetValue(d)}
            min={min(d)}
            max={max(d)}
            {...offsetProp(d)}
            firstQuartile={firstQuartile(d)}
            thirdQuartile={thirdQuartile(d)}
            median={median(d)}
            boxWidth={actualyWidth * widthRatio}
            outliers={outliers(d)}
            fill={d.fill || callOrValue(fill, d, i)}
            stroke={d.stroke || callOrValue(stroke, d, i)}
            strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
            fillOpacity={d.fillOpacity || callOrValue(fillOpacity, d, i)}
            valueScale={valueScale}
            horizontal={horizontal}
          />
        )
      ))}
    </Group>
  );
}

BoxPlotSeries.propTypes = propTypes;
BoxPlotSeries.defaultProps = defaultProps;
BoxPlotSeries.displayName = 'BoxPlotSeries';
