import { Arc } from '@vx/shape';
import React from 'react';
import PropTypes from 'prop-types';

import ArcLabel from '../label/ArcLabel';
import callOrValue from '../util/callOrValue';

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
  })).isRequired,
  pieValue: PropTypes.func.isRequired, // (d) => pie value
  pieSort: PropTypes.func,

  radius: PropTypes.number, // likely passed by parent
  innerRadius: PropTypes.oneOfType([PropTypes.func, PropTypes.number]), // (radius) => num
  outerRadius: PropTypes.oneOfType([PropTypes.func, PropTypes.number]), // (radius) => num
  labelRadius: PropTypes.oneOfType([PropTypes.func, PropTypes.number]), // (radius) => num
  labelComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  label: PropTypes.func, // (arc) => node

  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  strokeWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fillOpacity: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),

  padAngle: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  padRadius: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  cornerRadius: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
};

const defaultProps = {
  radius: 300,
  pieSort: null,
  innerRadius: radius => radius * 0.5,
  outerRadius: radius => radius * 0.9,
  labelRadius: radius => radius * 0.75,
  cornerRadius: 3,
  fill: '#cccccc',
  fillOpacity: 1,
  stroke: '#ffffff',
  strokeWidth: 1,
  labelComponent: <ArcLabel />,
  label: null,
  padAngle: null,
  padRadius: null,
};

export default function ArcSeries({
  data,
  radius,
  pieValue,
  pieSort,
  innerRadius,
  outerRadius,
  labelRadius,
  fill,
  fillOpacity,
  cornerRadius,
  padAngle,
  padRadius,
  stroke,
  strokeWidth,
  label,
  labelComponent,
  ...restProps
}) {
  return (
    <g>
      <Arc
        data={data}
        pieValue={pieValue}
        pieSort={pieSort}
        outerRadius={callOrValue(outerRadius, radius)}
        innerRadius={callOrValue(innerRadius, radius)}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        cornerRadius={cornerRadius}
        padAngle={padAngle}
        padRadius={padRadius}
        {...restProps}
      />
      {label && labelComponent &&
        <Arc
          data={data}
          pieValue={pieValue}
          pieSort={pieSort}
          outerRadius={callOrValue(labelRadius, radius)}
          innerRadius={callOrValue(labelRadius, radius)}
          fill="none"
          fillOpacity={0}
          stroke="none"
          strokeWidth={0}
          centroid={(centroid, arc) => {
            const [x, y] = centroid;
            const labelElement = label(arc);
            if (arc.endAngle - arc.startAngle < 0.1 || !labelElement) return null;
            return React.cloneElement(labelComponent, { x, y, arc }, labelElement);
          }}
        />}
    </g>
  );
}

ArcSeries.propTypes = propTypes;
ArcSeries.defaultProps = defaultProps;
ArcSeries.displayName = 'ArcSeries';
