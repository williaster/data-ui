import { color } from '@data-ui/theme';
import { FocusBlurHandler } from '@data-ui/shared';
import { GlyphDot } from '@vx/glyph';
import { Threshold } from '@vx/threshold';
import PropTypes from 'prop-types';
import React, { Children } from 'react';

import { callOrValue, isDefined } from '../utils/chartUtils';
import findClosestDatum from '../utils/findClosestDatum';
import interpolatorLookup from '../utils/interpolatorLookup';
import { interpolationShape, lineSeriesDataShape } from '../utils/propShapes';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,

  // data: lineSeriesDataShape.isRequired,
  interpolation: interpolationShape,
  // showPoints: PropTypes.bool,
  // stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  // strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  // strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  // strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
};

const defaultProps = {
  interpolation: 'monotoneX',
  // showPoints: false,
  // stroke: color.default,
  // strokeDasharray: null,
  // strokeWidth: 3,
  // strokeLinecap: 'round',
};

const x = d => d.x;
const y = d => d.y;
const defined = d => isDefined(y(d));
const noEventsStyles = { pointerEvents: 'none' };

export default class ThresholdSeries extends React.PureComponent {
  render() {
    const {
      // data,
      fills,
      fillOpacities,
      disableMouseEvents,
      interpolation,
      // showPoints,
      // stroke,
      // strokeDasharray,
      // strokeWidth,
      // strokeLinecap,
      xScale,
      yScale,
      onClick,
      onMouseMove,
      onMouseLeave,
      children,
    } = this.props;
    const childArray = Children.toArray(children);
    if (!xScale || !yScale || childArray.length !== 2) return null;
    const childData1 = childArray[0].props.data;
    const childData2 = childArray[1].props.data;
    const mergedData = childData1.map((d, i) => ({
      x: d.x,
      y0: d.y,
      y1: childData2[i].y,
    }));
    const curve = interpolatorLookup[interpolation] || interpolatorLookup.monotoneX;
    const yExtent = yScale.range();

    return (
      <g>
        <Threshold
          data={mergedData}
          x={d => d.x}
          y0={d => d.y0}
          y1={d => d.y1}
          xScale={xScale}
          yScale={yScale}
          clipAboveTo={Math.min(...yExtent)}
          clipBelowTo={Math.max(...yExtent)}
          curve={curve}
          aboveAreaProps={{
            fill: (fills && fills[0]) || color.categories[0],
            fillOpacity: (fillOpacities && fillOpacities[0]) || 0.4,
          }}
          belowAreaProps={{
            fill: (fills && fills[1]) || color.categories[1],
            fillOpacity: (fillOpacities && fillOpacities[1]) || 0.4,
          }}
        />
        {Children.map(children, Child =>
          React.cloneElement(Child, {
            xScale,
            yScale,
            interpolation,
            onClick,
            onMouseMove,
            onMouseLeave,
          }),
        )}
      </g>
    );
  }
}

ThresholdSeries.propTypes = propTypes;
ThresholdSeries.defaultProps = defaultProps;
ThresholdSeries.displayName = 'ThresholdSeries';
