import React from 'react';
import PropTypes from 'prop-types';

import Area from '@vx/shape/build/shapes/Area';
import Group from '@vx/group/build/Group';
import LinePath from '@vx/shape/build/shapes/LinePath';
import color from '@data-ui/theme/build/color';

import interpolatorLookup from '../utils/interpolatorLookup';
import { callOrValue, isDefined } from '../utils/chartUtils';
import findClosestDatum from '../utils/findClosestDatum';
import { areaSeriesDataShape, interpolationShape } from '../utils/propShapes';

const propTypes = {
  data: areaSeriesDataShape.isRequired,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  interpolation: interpolationShape,
  label: PropTypes.string.isRequired,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  // these will likely be injected by the parent chart
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

const defaultProps = {
  interpolation: 'monotoneX',
  stroke: color.default,
  strokeWidth: 3,
  strokeDasharray: null,
  strokeLinecap: 'round',
  fill: color.default,
  fillOpacity: 0.3,
  xScale: null,
  yScale: null,
  onMouseMove: undefined,
  onMouseLeave: undefined,
};

const x = d => d.x;
const getY = d => d.y;
const getY0 = d => d.y0;
const getY1 = d => d.y1;
const definedClosed = d => isDefined(getY(d));
const definedOpen = d => isDefined(getY0(d)) && isDefined(getY1(d));

export default class AreaSeries extends React.PureComponent {
  render() {
    const {
      data,
      xScale,
      yScale,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeLinecap,
      fill,
      fillOpacity,
      interpolation,
      label,
      onMouseMove,
      onMouseLeave,
    } = this.props;
    if (!xScale || !yScale) return null;
    const datum0 = data[0] || {};
    const isClosed = !definedOpen(datum0);
    const yMin = yScale.domain()[0];
    const y0 = isClosed ? () => yMin : getY0;
    const y1 = isClosed ? getY : getY1;
    const defined = isClosed ? definedClosed : definedOpen;
    const strokeDasharrayValue = callOrValue(strokeDasharray, data);
    const strokeValue = callOrValue(stroke, data);
    const strokeWidthValue = callOrValue(strokeWidth, data);
    const fillValue = callOrValue(fill, data);
    const curve = interpolatorLookup[interpolation] || interpolatorLookup.monotoneX;
    return (
      <Group
        key={label}
        onMouseMove={onMouseMove && ((event) => {
          const d = findClosestDatum({ data, getX: x, event, xScale });
          onMouseMove({ event, data, datum: d, color: fillValue });
        })}
        onMouseLeave={onMouseLeave}
      >
        <Area
          data={data}
          x={x}
          y0={y0}
          y1={y1}
          xScale={xScale}
          yScale={yScale}
          fill={fillValue}
          fillOpacity={callOrValue(fillOpacity, data)}
          stroke="transparent"
          strokeWidth={strokeWidthValue}
          curve={curve}
          defined={defined}
        />
        {/* only draw a stroke for the top and bottom */}
        {strokeWidthValue > 0 && !isClosed &&
          <LinePath
            data={data}
            x={x}
            y={y0}
            xScale={xScale}
            yScale={yScale}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
            strokeDasharray={strokeDasharrayValue}
            strokeLinecap={strokeLinecap}
            curve={curve}
            glyph={null}
            defined={defined}
          />}
        {strokeWidthValue > 0 &&
          <LinePath
            data={data}
            x={x}
            y={y1}
            xScale={xScale}
            yScale={yScale}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
            strokeDasharray={strokeDasharrayValue}
            strokeLinecap={strokeLinecap}
            curve={curve}
            glyph={null}
            defined={defined}
          />}
      </Group>
    );
  }
}

AreaSeries.propTypes = propTypes;
AreaSeries.defaultProps = defaultProps;
AreaSeries.displayName = 'AreaSeries';
