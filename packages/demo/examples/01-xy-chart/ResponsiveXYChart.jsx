/* eslint react/prop-types: 0 */
import React from 'react';
import { timeParse, timeFormat } from 'd3-time-format';

import {
  XYChart,
  theme,
  withScreenSize,
} from '@data-ui/xy-chart';

export const parseDate = timeParse('%Y%m%d');
export const formatDate = timeFormat('%b %d');
export const dateFormatter = date => formatDate(parseDate(date));

// this is a little messy to handle all cases across series types
function renderTooltip({ datum, key, color }) {
  const { x, x0, y, value } = datum;
  let xVal = x || x0;
  if (typeof xVal === 'string') {
    xVal = parseDate(xVal) === null ? xVal : dateFormatter(xVal);
  } else if (typeof xVal !== 'string' && Number(xVal) > 1000000) {
    xVal = formatDate(xVal);
  }
  const yVal = key && datum[key] ? datum[key] : (y || value || '--');
  return (
    <div>
      {key &&
        <div>
          <strong style={{ color }}>{key}</strong>
        </div>}
      <div>
        <strong style={{ color }}>x </strong>
        {xVal && xVal.toFixed ? xVal.toFixed(2) : xVal}
      </div>
      <div>
        <strong style={{ color }}>y </strong>
        {yVal && yVal.toFixed ? yVal.toFixed(2) : yVal}
      </div>
    </div>
  );
}

function ResponsiveXYChart({ screenWidth, children, ...rest }) {
  return (
    <XYChart
      theme={theme}
      width={Math.min(1000, screenWidth / 1.5)}
      height={Math.min(1000 / 2, screenWidth / 1.5 / 2)}
      renderTooltip={renderTooltip}
      {...rest}
    >
      {children}
    </XYChart>
  );
}

export default withScreenSize(ResponsiveXYChart);
