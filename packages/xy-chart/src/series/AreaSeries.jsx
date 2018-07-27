import Area from '@vx/shape/build/shapes/Area';
import color from '@data-ui/theme/build/color';
import FocusBlurHandler from '@data-ui/shared/build/components/FocusBlurHandler';
import Group from '@vx/group/build/Group';
import LinePath from '@vx/shape/build/shapes/LinePath';
import PropTypes from 'prop-types';
import React from 'react';

import { areaSeriesDataShape, interpolationShape } from '../utils/propShapes';
import { callOrValue, isDefined } from '../utils/chartUtils';
import findClosestDatum from '../utils/findClosestDatum';
import interpolatorLookup from '../utils/interpolatorLookup';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,
  data: areaSeriesDataShape.isRequired,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  interpolation: interpolationShape,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
};

const defaultProps = {
  interpolation: 'monotoneX',
  stroke: color.default,
  strokeWidth: 3,
  strokeDasharray: null,
  strokeLinecap: 'round',
  fill: color.default,
  fillOpacity: 0.3,
};

const x = d => d && d.x;
const getY = d => d && d.y;
const getY0 = d => d && d.y0;
const getY1 = d => d && d.y1;
const definedClosed = d => isDefined(getY(d));
const definedOpen = d => isDefined(getY0(d)) && isDefined(getY1(d));
const noEventsStyles = { pointerEvents: 'none' };

export default class AreaSeries extends React.PureComponent {
  render() {
    const {
      data,
      disableMouseEvents,
      xScale,
      yScale,
      stroke,
      strokeWidth,
      strokeDasharray,
      strokeLinecap,
      fill,
      fillOpacity,
      interpolation,
      onClick,
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
        style={disableMouseEvents ? noEventsStyles : null}
        onClick={
          disableMouseEvents
            ? null
            : onClick &&
              (event => {
                const d = findClosestDatum({ data, getX: x, event, xScale });
                onClick({ event, data, datum: d, color: fillValue });
              })
        }
        onMouseMove={
          disableMouseEvents
            ? null
            : onMouseMove &&
              (event => {
                const d = findClosestDatum({ data, getX: x, event, xScale });
                onMouseMove({ event, data, datum: d, color: fillValue });
              })
        }
        onMouseLeave={disableMouseEvents ? null : onMouseLeave}
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
        {strokeWidthValue > 0 &&
          !isClosed && (
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
            />
          )}
        {/* draw this path even if strokewidth is 0, for focus/blur support */}
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
          defined={defined}
          glyph={(d, i) => (
            <FocusBlurHandler
              key={`areapoint-${i}`}
              onBlur={disableMouseEvents ? null : onMouseLeave}
              onFocus={
                disableMouseEvents
                  ? null
                  : event => {
                      onMouseMove({
                        event,
                        data,
                        datum: d,
                        color: strokeValue,
                        index: i,
                      });
                    }
              }
            />
          )}
        />
      </Group>
    );
  }
}

AreaSeries.propTypes = propTypes;
AreaSeries.defaultProps = defaultProps;
AreaSeries.displayName = 'AreaSeries';
