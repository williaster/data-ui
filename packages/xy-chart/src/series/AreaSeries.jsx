import React from 'react';
import PropTypes from 'prop-types';

import { AreaClosed, LinePath } from '@vx/shape';
import { Group } from '@vx/group';
import { color } from '@data-ui/theme';

import interpolatorLookup from '../utils/interpolatorLookup';
import { callOrValue, isDefined } from '../utils/chartUtils';
import findClosestDatum from '../utils/findClosestDatum';
import { lineSeriesDataShape } from '../utils/propShapes';

const propTypes = {
  data: lineSeriesDataShape.isRequired,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  interpolation: PropTypes.oneOf(['linear', 'cardinal']), // @todo add more
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
  interpolation: 'cardinal',
  stroke: color.default,
  strokeWidth: 3,
  strokeDasharray: null,
  strokeLinecap: 'round',
  fill: color.default,
  fillOpacity: 0.3,
  xScale: null,
  yScale: null,
  onMouseMove: null,
  onMouseLeave: null,
};

const x = d => d.x;
const y = d => d.y;
const defined = d => isDefined(y(d));

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
    const strokeWidthValue = callOrValue(strokeWidth, data);
    const fillValue = callOrValue(fill, data);
    const curve = interpolatorLookup[interpolation] || interpolatorLookup.cardinal;
    return (
      <Group
        onMouseMove={onMouseMove && ((event) => {
          const d = findClosestDatum({ data, getX: x, event, xScale });
          onMouseMove({ event, data, datum: d, color: fillValue });
        })}
        onMouseLeave={onMouseLeave}
      >
        <AreaClosed
          key={`${label}-area`}
          data={data}
          x={x}
          y={y}
          xScale={xScale}
          yScale={yScale}
          fill={fillValue}
          fillOpacity={callOrValue(fillOpacity, data)}
          stroke="transparent"
          strokeWidth={strokeWidthValue}
          curve={curve}
          defined={defined}
        />
        {strokeWidthValue > 0 &&
          <LinePath
            key={`${label}-line`}
            data={data}
            x={x}
            y={y}
            xScale={xScale}
            yScale={yScale}
            stroke={callOrValue(stroke, data)}
            strokeWidth={strokeWidthValue}
            strokeDasharray={callOrValue(strokeDasharray, data)}
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
