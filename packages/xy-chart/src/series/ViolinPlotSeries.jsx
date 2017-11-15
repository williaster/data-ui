import React from 'react';
import PropTypes from 'prop-types';
import Group from '@vx/group/build/Group';
import ViolinPlot from '@vx/stats/build/violinplot/ViolinPlot';
import themeColors from '@data-ui/theme/build/color';

import { callOrValue } from '../utils/chartUtils';

import { violinPlotSeriesDataShape } from '../utils/propShapes';


const propTypes = {
  data: violinPlotSeriesDataShape.isRequired,

  // attributes on data points will override these
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  // likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  horizontal: PropTypes.bool,
  widthRatio: PropTypes.number,
};

const defaultProps = {
  boxWidth: null,
  stroke: themeColors.darkGray,
  strokeWidth: 2,
  fill: themeColors.default,
  xScale: null,
  yScale: null,
  horizontal: false,
  widthRatio: 1,
};

const MAX_BOX_WIDTH = 50;
const x = d => d.x;
const y = d => d.y;

export default function ViolinPlotSeries({
  data,
  fill,
  stroke,
  strokeWidth,
  xScale,
  yScale,
  horizontal,
  widthRatio,
}) {
  if (!xScale || !yScale) return null;
  const offsetScale = horizontal ? yScale : xScale;
  const offsetValue = horizontal ? y : x;
  const valueScale = horizontal ? xScale : yScale;
  const boxWidth = offsetScale.bandwidth();
  const actualWidth = Math.min(MAX_BOX_WIDTH, boxWidth);
  const offset = (offsetScale.offset || 0) - ((boxWidth - actualWidth) / 2);
  const offsetPropName = horizontal ? 'top' : 'left';
  const offsetProp = d => ({
    [offsetPropName]: (offsetScale(offsetValue(d)) - offset) +
     (((1 - widthRatio) / 2) * actualWidth),
  });
  return (
    <Group>
      {data.map((d, i) => (
        <ViolinPlot
          key={offsetValue(d)}
          {...offsetProp(d)}
          binData={d.binData}
          width={actualWidth * widthRatio}
          fill={d.fill || callOrValue(fill, d, i)}
          stroke={d.stroke || callOrValue(stroke, d, i)}
          strokeWidth={d.strokeWidth || callOrValue(strokeWidth, d, i)}
          valueScale={valueScale}
          horizontal={horizontal}
        />
      ))
    }
    </Group>
  );
}

ViolinPlotSeries.propTypes = propTypes;
ViolinPlotSeries.defaultProps = defaultProps;
ViolinPlotSeries.displayName = 'ViolinPlotSeries';
