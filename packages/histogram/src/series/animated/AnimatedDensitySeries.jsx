import PropTypes from 'prop-types';
import React from 'react';
import { NodeGroup } from 'react-move';

import { AreaClosed, LinePath } from '@vx/shape';
import { curveBasis } from '@vx/curve';
import { Group } from '@vx/group';
import { chartTheme } from '@data-ui/theme';


const propTypes = {
  densityData: PropTypes.array.isRequired, // @TODO shape
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  getX: PropTypes.func.isRequired,
  getY: PropTypes.func.isRequired,
  horizontal: PropTypes.bool,
  keyAccessor: PropTypes.func,
  showArea: PropTypes.bool,
  showLine: PropTypes.bool,
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeDasharray: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round', 'inherit']),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
};

const defaultProps = {
  fill: chartTheme.colors.default,
  fillOpacity: 0.3,
  horizontal: false,
  showArea: true,
  showLine: true,
  stroke: chartTheme.colors.default,
  strokeWidth: 2,
  strokeDasharray: null,
  strokeLinecap: 'round',
  keyAccessor: d => d.id,
};

function AnimatedDensitySeries({
  densityData,
  fill,
  fillOpacity,
  horizontal,
  keyAccessor,
  getX,
  getY,
  showArea,
  showLine,
  stroke,
  strokeWidth,
  strokeDasharray,
  strokeLinecap,
  xScale,
  yScale,
}) {
  const maxY = Math.max(...yScale.range());
  return (
    <NodeGroup
      data={densityData}
      keyAccessor={keyAccessor}
      start={(d) => {
        if (horizontal) return { x: 0, y: yScale.invert ? yScale(getY(d)) : getY(d) };
        return { x: xScale.invert ? xScale(getX(d)) : getX(d), y: maxY };
      }}
      enter={(d, i) => ({
        x: [xScale.invert ? xScale(getX(d)) : getX(d)],
        y: [yScale.invert ? yScale(getY(d)) : getY(d)],
        fill: [d.fill || fill],
        stroke: [d.stroke || stroke],
        timing: { duration: 300, delay: 10 * i },
      })}
      update={(d, i) => ({
        x: [xScale.invert ? xScale(getX(d)) : getX(d)],
        y: [yScale.invert ? yScale(getY(d)) : getY(d)],
        fill: [d.fill || fill],
        stroke: [d.stroke || stroke],
        timing: { duration: 300, delay: 10 * i },
      })}
      leave={(d, i) => ({
        x: xScale.invert ? xScale(getX(d)) : getX(d),
        y: horizontal ? 0 : maxY,
        timing: { duration: 300, delay: 5 * i },
      })}
    >
      {modifiedData => (
        <Group style={{ pointerEvents: 'none' }}>
          {showArea &&
            <AreaClosed
              data={modifiedData}
              x={d => (xScale.invert ? xScale.invert(d.state.x) : d.state.x)}
              y={d => (yScale.invert ? yScale.invert(d.state.y) : d.state.y)}
              xScale={xScale}
              yScale={yScale}
              fill={fill}
              fillOpacity={fillOpacity}
              stroke="transparent"
              strokeWidth={strokeWidth}
              curve={curveBasis}
            />}
          {showLine && strokeWidth > 0 &&
            <LinePath
              data={modifiedData}
              x={d => (xScale.invert ? xScale.invert(d.state.x) : d.state.x)}
              y={d => (yScale.invert ? yScale.invert(d.state.y) : d.state.y)}
              xScale={xScale}
              yScale={yScale}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeLinecap={strokeLinecap}
              curve={curveBasis}
              glyph={null}
            />}
        </Group>
      )}
    </NodeGroup>
  );
}

AnimatedDensitySeries.propTypes = propTypes;
AnimatedDensitySeries.defaultProps = defaultProps;

export default AnimatedDensitySeries;
