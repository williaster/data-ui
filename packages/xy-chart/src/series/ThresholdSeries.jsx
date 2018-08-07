import { color } from '@data-ui/theme';
import { Threshold } from '@vx/threshold';
import PropTypes from 'prop-types';
import React, { Children } from 'react';

import interpolatorLookup from '../utils/interpolatorLookup';
import { interpolationShape } from '../utils/propShapes';
import sharedSeriesProps from '../utils/sharedSeriesProps';

const propTypes = {
  ...sharedSeriesProps,
  children: PropTypes.node.isRequired, // AreaSeries type
  interpolation: interpolationShape,
};

const defaultProps = {
  interpolation: 'monotoneX',
};

const DEFAULT_OPACITY = 0.4;

const getX = d => d.x;
const getY0 = d => d.y0;
const getY1 = d => d.y1;

export default class AreaDifference extends React.PureComponent {
  render() {
    const {
      disableMouseEvents,
      interpolation,
      xScale,
      yScale,
      onClick,
      onMouseMove,
      onMouseLeave,
      children,
    } = this.props;

    if (!xScale || !yScale) return null;

    const childArray = Children.toArray(children);
    const [child1, child2] = childArray;

    if (
      childArray.length !== 2 ||
      child1.type.displayName !== 'AreaSeries' ||
      child2.type.displayName !== 'AreaSeries'
    ) {
      console.warn('ThresholdSeries expects exactly two AreaSeries children');

      return null;
    }

    const { data: data1, fill: fill1, fillOpacity: opacity1 } = child1.props;
    const { data: data2, fill: fill2, fillOpacity: opacity2 } = child2.props;

    if (data1.length !== data2.length) {
      console.warn('ThresholdSeries children should have the same data length');

      return null;
    }

    const curve = interpolatorLookup[interpolation] || interpolatorLookup.monotoneX;
    const yExtent = yScale.range();
    const mergedData = data1.map((d, i) => ({
      x: d.x,
      y0: d.y,
      y1: data2[i].y,
    }));

    return (
      <g>
        <Threshold
          data={mergedData}
          x={getX}
          y0={getY0}
          y1={getY1}
          xScale={xScale}
          yScale={yScale}
          clipAboveTo={Math.min(...yExtent)}
          clipBelowTo={Math.max(...yExtent)}
          curve={curve}
          aboveAreaProps={{
            fill: fill1 || color.categories[0],
            fillOpacity: opacity1 || DEFAULT_OPACITY,
          }}
          belowAreaProps={{
            fill: fill2 || color.categories[0],
            fillOpacity: opacity2 || DEFAULT_OPACITY,
          }}
        />
        {/* Threshold series do NOT plot lines, so render the area series without fill */}
        {childArray.map(Child =>
          React.cloneElement(Child, {
            xScale,
            yScale,
            onClick,
            onMouseMove,
            onMouseLeave,
            interpolation,
            disableMouseEvents: Child.props.disableMouseEvents || disableMouseEvents,
            fill: 'transparent',
          }),
        )}
      </g>
    );
  }
}

AreaDifference.propTypes = propTypes;
AreaDifference.defaultProps = defaultProps;
AreaDifference.displayName = 'AreaDifference';
